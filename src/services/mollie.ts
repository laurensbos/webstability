// Mollie Payment Service
// Voor het aanmaken en beheren van betalingen

const API_BASE = '/api';

export interface PaymentRequest {
  amount: string; // Format: "99.00"
  description: string;
  customerEmail: string;
  customerName: string;
  projectId?: string;
  packageType?: string;
  businessName?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentUrl: string;
  paymentId: string;
  status: string;
}

export interface PaymentStatus {
  id: string;
  status: 'open' | 'pending' | 'paid' | 'failed' | 'canceled' | 'expired';
  amount: {
    value: string;
    currency: string;
  };
  description: string;
  paidAt?: string;
  metadata?: Record<string, string>;
}

// Pakket prijzen
export const PACKAGE_PRICES: Record<string, number> = {
  starter: 79,
  professional: 149,
  business: 249,
};

// Helper: formatteer bedrag voor Mollie
export function formatAmount(amount: number): string {
  return amount.toFixed(2);
}

// Helper: haal pakketprijs op
export function getPackagePrice(packageName: string): number {
  const key = packageName?.toLowerCase() || 'starter';
  return PACKAGE_PRICES[key] || 79;
}

// Maak een betaallink aan
export async function createPaymentLink(data: PaymentRequest): Promise<PaymentResponse> {
  const response = await fetch(`${API_BASE}/create-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: data.amount,
      description: data.description,
      customerEmail: data.customerEmail,
      customerName: data.customerName,
      redirectUrl: `${window.location.origin}/betaling-succes`,
      metadata: {
        projectId: data.projectId,
        package: data.packageType,
        businessName: data.businessName,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Betaling aanmaken mislukt');
  }

  return response.json();
}

// Haal betalingsstatus op
export async function getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
  const response = await fetch(`${API_BASE}/get-payment?paymentId=${paymentId}`);
  
  if (!response.ok) {
    throw new Error('Betalingsstatus ophalen mislukt');
  }

  return response.json();
}
