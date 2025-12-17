// Discount Code Types
export interface DiscountCode {
  id: string;
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'setup_free';
  value: number; // percentage (0-100) or fixed amount in euros
  appliesToSetup: boolean;
  appliesToMonthly: boolean;
  validUntil: string; // ISO date string
  maxUses: number | null; // null = unlimited
  currentUses: number;
  isActive: boolean;
  createdAt: string;
}

export interface AppliedDiscount {
  code: string;
  type: 'percentage' | 'fixed' | 'setup_free';
  value: number;
  description: string;
  setupDiscount: number;
  monthlyDiscount: number;
}

// Default discount codes
export const DEFAULT_DISCOUNT_CODES: DiscountCode[] = [
  {
    id: 'gratis26',
    code: 'GRATIS26',
    description: 'Geen opstartkosten - Nieuwjaarsactie 2026',
    type: 'setup_free',
    value: 100,
    appliesToSetup: true,
    appliesToMonthly: false,
    validUntil: '2026-03-01T23:59:59.000Z',
    maxUses: null,
    currentUses: 0,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Validate discount code
export function validateDiscountCode(
  code: string,
  codes: DiscountCode[]
): { valid: boolean; discount?: DiscountCode; error?: string } {
  const normalizedCode = code.trim().toUpperCase();
  const discount = codes.find(c => c.code === normalizedCode);

  if (!discount) {
    return { valid: false, error: 'Kortingscode niet gevonden' };
  }

  if (!discount.isActive) {
    return { valid: false, error: 'Deze kortingscode is niet meer actief' };
  }

  const now = new Date();
  const validUntil = new Date(discount.validUntil);
  if (now > validUntil) {
    return { valid: false, error: 'Deze kortingscode is verlopen' };
  }

  if (discount.maxUses !== null && discount.currentUses >= discount.maxUses) {
    return { valid: false, error: 'Deze kortingscode is al maximaal gebruikt' };
  }

  return { valid: true, discount };
}

// Calculate discount amounts
export function calculateDiscount(
  discount: DiscountCode,
  setupFee: number,
  monthlyFee: number
): AppliedDiscount {
  let setupDiscount = 0;
  let monthlyDiscount = 0;

  if (discount.type === 'setup_free') {
    setupDiscount = setupFee;
  } else if (discount.type === 'percentage') {
    if (discount.appliesToSetup) {
      setupDiscount = Math.round(setupFee * (discount.value / 100));
    }
    if (discount.appliesToMonthly) {
      monthlyDiscount = Math.round(monthlyFee * (discount.value / 100));
    }
  } else if (discount.type === 'fixed') {
    if (discount.appliesToSetup) {
      setupDiscount = Math.min(discount.value, setupFee);
    }
    if (discount.appliesToMonthly) {
      monthlyDiscount = Math.min(discount.value, monthlyFee);
    }
  }

  return {
    code: discount.code,
    type: discount.type,
    value: discount.value,
    description: discount.description,
    setupDiscount,
    monthlyDiscount,
  };
}
