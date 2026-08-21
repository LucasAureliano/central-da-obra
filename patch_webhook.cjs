const fs = require('fs');

let webhookCode = fs.readFileSync('api/stripe/webhook.ts', 'utf8');

// Add the config to disable bodyParser
if (!webhookCode.includes("export const config = {")) {
  webhookCode = webhookCode.replace(
    "export default async function handler(req: VercelRequest, res: VercelResponse) {",
    "export const config = {\n  api: {\n    bodyParser: false,\n  },\n};\n\nexport default async function handler(req: VercelRequest, res: VercelResponse) {"
  );
}

// Write a helper function to get rawBody
const rawBodyHelper = `
async function getRawBody(req: VercelRequest): Promise<Buffer> {
  const chunks: any[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
`;

if (!webhookCode.includes("async function getRawBody")) {
  webhookCode = webhookCode.replace(
    "export default async function handler",
    rawBodyHelper + "\nexport default async function handler"
  );
}

// Restore webhook signature verification
let newWebhookCode = webhookCode.replace(
  `    let event: Stripe.Event = req.body;

    if (STRIPE_WEBHOOK_SECRET) {
      const signature = req.headers['stripe-signature'];
      if (!signature) return res.status(400).json({ error: 'Missing stripe-signature' });
      // In a real vercel function you'd need the rawBody to verify
      // event = stripe.webhooks.constructEvent(req.rawBody, signature, STRIPE_WEBHOOK_SECRET);
    }`,
  `    const rawBody = await getRawBody(req);
    let event: Stripe.Event;

    if (STRIPE_WEBHOOK_SECRET) {
      const signature = req.headers['stripe-signature'];
      if (!signature) return res.status(400).json({ error: 'Missing stripe-signature' });
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
      } catch (err: any) {
        console.error('Webhook signature verification failed.', err.message);
        return res.status(400).send(\`Webhook Error: \${err.message}\`);
      }
    } else {
      // Fallback only if no secret is configured (dev mode)
      event = JSON.parse(rawBody.toString());
    }`
);

fs.writeFileSync('api/stripe/webhook.ts', newWebhookCode, 'utf8');
