/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import { API } from "../lib/api.js";

const STORAGE_KEY = "ttb:cart";

const CartContext = createContext(null);

function parsePriceValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const sanitized = value
      .replace(/[^0-9,.-]/g, "")
      .replace(/,(?=[^,]*$)/, ".");
    const numeric = Number.parseFloat(sanitized);
    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }

  if (value && typeof value === "object") {
    if (typeof value.amount === "number") {
      return value.amount;
    }
    if (typeof value.amount === "string") {
      const parsed = parsePriceValue(value.amount);
      if (parsed !== null) {
        return parsed;
      }
    }
    if (typeof value.value === "number") {
      return value.value;
    }
    if (typeof value.value === "string") {
      const parsed = parsePriceValue(value.value);
      if (parsed !== null) {
        return parsed;
      }
    }
  }

  return null;
}

function inferCurrency(product = {}) {
  const candidate =
    product.currency ||
    product.currencyCode ||
    product.priceCurrency ||
    product.price?.currency ||
    product.price?.currencyCode ||
    product.price?.currency_symbol ||
    "chf";

  if (typeof candidate === "string" && candidate.trim()) {
    return candidate.trim().toLowerCase();
  }

  return "chf";
}

function extractPrice(product = {}) {
  const candidates = [
    product.price,
    product.priceAmount,
    product.price_value,
    product.priceValue,
    product.priceInclTax,
    product.priceExclTax,
    product.price_inc_tax,
    product.price_ex_tax,
    product.defaultPrice,
    product.amount,
    product.total,
  ];

  for (const candidate of candidates) {
    const parsed = parsePriceValue(candidate);
    if (parsed !== null) {
      return { amount: parsed, currency: inferCurrency(product) };
    }
  }

  return { amount: 0, currency: inferCurrency(product) };
}

function withProxy(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const parsed = new URL(url);
    if (parsed.pathname.includes("/api/proxy/image")) {
      return url;
    }
  } catch {
    // non absolute URLs -> let’s just return as-is
    return url;
  }

  if (!API) return url;
  return `${API}/api/proxy/image?url=${encodeURIComponent(url)}`;
}

function extractOriginalFromProxy(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const parsed = new URL(url);
    if (!parsed.pathname.includes("/api/proxy/image")) return null;
    const original = parsed.searchParams.get("url");
    return original ? decodeURIComponent(original) : null;
  } catch {
    return null;
  }
}

function pickImage(product = {}) {
  const direct =
    product.image ||
    product.previewUrl ||
    product.externalPreviewUrl ||
    product.externalThumbnailUrl ||
    product.thumbnailUrl ||
    null;

  if (direct) return direct;
  if (product.imageOriginal || product.originalImage) {
    return withProxy(product.imageOriginal || product.originalImage);
  }

  return null;
}

function normalizeProduct(product) {
  if (!product) return null;

  const id =
    product.id ||
    product.productId ||
    product.slug ||
    product.handle ||
    product.sku ||
    null;

  if (!id) return null;

  const providedTitle = product.title || product.name || null;
  const productTitle =
    product.productTitle ||
    product.parentTitle ||
    product.parent?.title ||
    providedTitle ||
    `Produit ${id}`;
  const variantTitle =
    product.variantTitle ||
    product.variantName ||
    product.variant_label ||
    product.variant?.title ||
    product.variant?.name ||
    null;
  const displayTitle = product.displayTitle || providedTitle || (variantTitle ? `${productTitle} — ${variantTitle}` : productTitle);
  const { amount, currency } = extractPrice(product);
  const imageOriginal = product.imageOriginal || product.originalImage || null;
  const image = pickImage(product) || withProxy(imageOriginal);
  const productUid = product.productUid || product?.variant?.productUid || null;

  return {
    id: String(id),
    title: displayTitle,
    productTitle,
    variantTitle,
    variantId: product.variantId || product.variant?.id || null,
    variantSku: product.variantSku || product.variant?.sku || null,
    price: Number.isFinite(amount) ? amount : 0,
    currency,
    image,
    imageOriginal,
    productUid,
  };
}


function cartReducer(state, action) {
  switch (action.type) {
    case "load": {
      return action.payload || { items: [] };
    }
    case "add": {
      const { item, quantity } = action.payload;
      const existing = state.items.find((entry) => entry.id === item.id);

      if (existing) {
        return {
          ...state,
          items: state.items.map((entry) =>
            entry.id === item.id
              ? { ...entry, quantity: Math.min(99, entry.quantity + quantity) }
              : entry
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { ...item, quantity: Math.min(99, Math.max(1, quantity)) }],
      };
    }
    case "remove": {
      const id = action.payload;
      return {
        ...state,
        items: state.items.filter((entry) => entry.id !== id),
      };
    }
    case "update": {
      const { id, quantity } = action.payload;
      return {
        ...state,
        items: state.items.map((entry) =>
          entry.id === id ? { ...entry, quantity: Math.min(99, Math.max(1, quantity)) } : entry
        ),
      };
    }
    case "clear": {
      return { items: [] };
    }
    default:
      return state;
  }
}

function initializeCart() {
  if (typeof window === "undefined") {
    return { items: [] };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return { items: [] };

  try {
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.items)) {
      return {
        items: parsed.items
          .filter((item) => item && item.id)
          .map((item) => {
            const imageOriginal =
              item.imageOriginal ||
              item.originalImage ||
              extractOriginalFromProxy(item.image) ||
              null;
            const image = item.image || withProxy(imageOriginal);

            return {
              ...item,
              quantity: Math.min(99, Math.max(1, Number.parseInt(item.quantity, 10) || 1)),
              price: Number.isFinite(item.price) ? item.price : 0,
              currency: (item.currency || "chf").toLowerCase(),
              image,
              imageOriginal,
            };
          }),
      };
    }
  } catch (error) {
    console.warn("Impossible de lire le panier depuis le stockage local", error);
  }

  return { items: [] };
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, initializeCart);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return undefined;
  }, [state]);

  const addItem = useCallback((product, quantity = 1) => {
    const normalized = normalizeProduct(product);
    if (!normalized) return;
    const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    dispatch({ type: "add", payload: { item: normalized, quantity: safeQuantity } });
  }, []);

  const removeItem = useCallback((id) => {
    dispatch({ type: "remove", payload: id });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    const safeQuantity = Math.max(1, Math.floor(Number(quantity) || 1));
    dispatch({ type: "update", payload: { id, quantity: safeQuantity } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const totals = useMemo(() => {
    const subtotalRaw = state.items.reduce(
      (acc, item) => acc + (Number.isFinite(item.price) ? item.price : 0) * item.quantity,
      0
    );
    const subtotal = Number.isFinite(subtotalRaw) ? Number(subtotalRaw.toFixed(2)) : 0;
    const totalQuantity = state.items.reduce((acc, item) => acc + item.quantity, 0);
    const currency = state.items[0]?.currency || "chf";
    return { subtotal, totalQuantity, currency };
  }, [state.items]);

  const value = useMemo(
    () => ({
      items: state.items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal: totals.subtotal,
      totalQuantity: totals.totalQuantity,
      currency: totals.currency,
    }),
    [state.items, addItem, removeItem, updateQuantity, clearCart, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart doit être utilisé dans un CartProvider");
  }
  return context;
}
