import { NextRequest, NextResponse } from "next/server";

// RDAP servers voor verschillende TLDs
const RDAP_SERVERS: Record<string, string> = {
  nl: "https://rdap.sidn.nl/domain/",
  com: "https://rdap.verisign.com/com/v1/domain/",
  net: "https://rdap.verisign.com/net/v1/domain/",
  org: "https://rdap.publicinterestregistry.org/rdap/domain/",
  eu: "https://rdap.eu/domain/",
  be: "https://rdap.dns.be/domain/",
  de: "https://rdap.denic.de/domain/",
  io: "https://rdap.nic.io/domain/",
  co: "https://rdap.nic.co/domain/",
  app: "https://rdap.nic.google/domain/",
  dev: "https://rdap.nic.google/domain/",
};

function extractTLD(domain: string): string {
  const parts = domain.toLowerCase().split(".");
  return parts[parts.length - 1] || "";
}

function normalizeDomain(input: string): string {
  // Verwijder protocol, www, en trailing slashes
  let domain = input.toLowerCase().trim();
  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.replace(/^www\./, "");
  domain = domain.replace(/\/.*$/, "");
  
  // Als er geen TLD is, voeg .nl toe
  if (!domain.includes(".")) {
    domain = `${domain}.nl`;
  }
  
  return domain;
}

export async function POST(request: NextRequest) {
  try {
    const { domain: rawDomain } = await request.json();

    if (!rawDomain || typeof rawDomain !== "string") {
      return NextResponse.json(
        { error: "Domein is verplicht" },
        { status: 400 }
      );
    }

    const domain = normalizeDomain(rawDomain);
    const tld = extractTLD(domain);

    // Valideer domein formaat
    const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/;
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: "Ongeldig domein formaat" },
        { status: 400 }
      );
    }

    const rdapServer = RDAP_SERVERS[tld];

    if (!rdapServer) {
      // Voor TLDs zonder bekende RDAP server, probeer DNS lookup
      try {
        const dnsResponse = await fetch(
          `https://dns.google/resolve?name=${domain}&type=A`,
          { next: { revalidate: 0 } }
        );
        const dnsData = await dnsResponse.json();
        
        // Als er DNS records zijn, is het domein bezet
        if (dnsData.Answer && dnsData.Answer.length > 0) {
          return NextResponse.json({
            domain,
            available: false,
            method: "dns",
          });
        }
        
        // Geen DNS records betekent waarschijnlijk beschikbaar
        // Maar we kunnen het niet 100% zeker weten
        return NextResponse.json({
          domain,
          available: true,
          method: "dns",
          uncertain: true,
        });
      } catch {
        return NextResponse.json({
          domain,
          available: null,
          error: `TLD .${tld} wordt niet ondersteund voor directe check`,
          method: "unsupported",
        });
      }
    }

    // RDAP lookup
    try {
      const rdapResponse = await fetch(`${rdapServer}${domain}`, {
        headers: {
          Accept: "application/rdap+json",
        },
        next: { revalidate: 0 },
      });

      if (rdapResponse.status === 404) {
        // Domein niet gevonden = beschikbaar
        return NextResponse.json({
          domain,
          available: true,
          method: "rdap",
        });
      }

      if (rdapResponse.ok) {
        // Domein gevonden = bezet
        const data = await rdapResponse.json();
        
        // Probeer registrar info te extraheren
        let registrar = null;
        if (data.entities) {
          const registrarEntity = data.entities.find(
            (e: { roles?: string[] }) => e.roles?.includes("registrar")
          );
          if (registrarEntity?.vcardArray?.[1]) {
            const fnField = registrarEntity.vcardArray[1].find(
              (f: unknown[]) => f[0] === "fn"
            );
            registrar = fnField?.[3] || null;
          }
        }

        return NextResponse.json({
          domain,
          available: false,
          method: "rdap",
          registrar,
        });
      }

      // Andere status codes
      throw new Error(`RDAP returned status ${rdapResponse.status}`);
    } catch (rdapError) {
      console.error("RDAP error:", rdapError);
      
      // Fallback naar DNS check
      try {
        const dnsResponse = await fetch(
          `https://dns.google/resolve?name=${domain}&type=NS`,
          { next: { revalidate: 0 } }
        );
        const dnsData = await dnsResponse.json();
        
        if (dnsData.Answer && dnsData.Answer.length > 0) {
          return NextResponse.json({
            domain,
            available: false,
            method: "dns-fallback",
          });
        }
        
        return NextResponse.json({
          domain,
          available: true,
          method: "dns-fallback",
          uncertain: true,
        });
      } catch {
        return NextResponse.json({
          domain,
          available: null,
          error: "Kon beschikbaarheid niet controleren",
          method: "error",
        });
      }
    }
  } catch (error) {
    console.error("Domain check error:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden" },
      { status: 500 }
    );
  }
}
