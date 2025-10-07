const CURRENCY_FALLBACK = "EUR";

export function parseAmount(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.replace(/[^0-9,.-]/g, "").replace(/,(?=[^,]*$)/, ".");
    const numeric = Number.parseFloat(normalized);
    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  if (value && typeof value === "object") {
    if (typeof value.amount === "number") return value.amount;
    if (typeof value.amount === "string") {
      const parsed = parseAmount(value.amount);
      if (parsed !== null) return parsed;
    }
    if (typeof value.value === "number") return value.value;
    if (typeof value.value === "string") {
      const parsed = parseAmount(value.value);
      if (parsed !== null) return parsed;
    }
    if (typeof value.min === "number") return value.min;
    if (typeof value.max === "number") return value.max;
  }

  return null;
}

export function inferCurrency(source, fallback = CURRENCY_FALLBACK) {
  if (!source) return fallback;
  const candidate =
    source.currency ||
    source.currencyCode ||
    source.priceCurrency ||
    source.price?.currency ||
    source.price?.currencyCode ||
    source.price?.currency_symbol ||
    source.currency_symbol ||
    fallback;

  if (typeof candidate === "string" && candidate.trim()) {
    return candidate.trim();
  }

  return fallback;
}

export function resolveRawPrice(product, variant) {
  const candidates = [
    variant?.price,
    variant?.retailPrice,
    variant?.priceAmount,
    variant?.priceInclTax,
    variant?.priceExclTax,
    product?.price,
    product?.priceAmount,
    product?.defaultPrice,
  ];

  for (const candidate of candidates) {
    const amount = parseAmount(candidate);
    if (amount !== null) {
      return { amount, currency: inferCurrency(variant, inferCurrency(product)) };
    }
  }

  return null;
}

export function applyDisplayPriceRules(amount) {
  if (!Number.isFinite(amount)) return null;

  const boosted = amount + 15;
  const baseThreshold = 4.9;

  if (boosted <= baseThreshold) {
    return Number(baseThreshold.toFixed(2));
  }

  const steps = Math.ceil((boosted - baseThreshold) / 5);
  const finalAmount = baseThreshold + steps * 5;
  return Number(finalAmount.toFixed(2));
}

export function resolveDisplayPrice(product, variant) {
  const rawPrice = resolveRawPrice(product, variant);
  if (!rawPrice) return null;
  const amount = applyDisplayPriceRules(rawPrice.amount);
  if (amount === null) return null;
  return { amount, currency: rawPrice.currency };
}

export function formatCurrency(amount, currency = CURRENCY_FALLBACK) {
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch (error) {
    return `${amount.toFixed(2)} ${currency}`;
  }
}
