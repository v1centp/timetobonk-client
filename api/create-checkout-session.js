const stripeSecretKey =
  typeof globalThis !== "undefined" &&
  globalThis?.["process"]?.env
    ? globalThis["process"].env.STRIPE_SECRET_KEY
    : undefined;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  if (!stripeSecretKey) {
    return res.status(500).json({ error: "Stripe n'est pas configuré côté serveur." });
  }

  let payload = req.body;
  if (typeof payload === "string") {
    try {
      payload = JSON.parse(payload);
    } catch {
      payload = {};
    }
  }

  const { items, successUrl, cancelUrl } = payload || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Aucun article à traiter." });
  }

  const sanitizedItems = [];

  for (const item of items) {
    if (!item || !item.title) continue;

    const amount = Math.round(Number(item.price) * 100);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: "Montant invalide pour un article." });
    }

    sanitizedItems.push({
      title: String(item.title),
      amount,
      currency: typeof item.currency === "string" && item.currency.trim() ? item.currency.trim().toLowerCase() : "eur",
      quantity: Math.max(1, Math.min(99, Math.floor(Number(item.quantity) || 1))),
    });
  }

  if (!sanitizedItems.length) {
    return res.status(400).json({ error: "Impossible de générer les articles pour le paiement." });
  }

  const origin = req.headers.origin || "";
  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("success_url", successUrl || `${origin}/checkout?success=true`);
  params.append("cancel_url", cancelUrl || `${origin}/checkout?canceled=true`);

  sanitizedItems.forEach((item, index) => {
    params.append(`line_items[${index}][price_data][currency]`, item.currency);
    params.append(`line_items[${index}][price_data][product_data][name]`, item.title);
    params.append(`line_items[${index}][price_data][unit_amount]`, String(item.amount));
    params.append(`line_items[${index}][quantity]`, String(item.quantity));
  });

  try {
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.error?.message || "Impossible de créer la session de paiement.";
      return res.status(response.status).json({ error: message });
    }

    return res.status(200).json({ id: data.id, url: data.url });
  } catch (error) {
    console.error("Erreur Stripe", error);
    return res.status(500).json({ error: "Impossible de contacter Stripe." });
  }
}
