# Automation (n8n)

This folder will contain n8n workflow JSON exports for:

1. **Application Tracking Webhook** — receives POST from the extension when a form is autofilled.
2. **Daily Application Summary** — aggregates tracked applications and sends a summary email/notification.
3. **Profile Update Alert** — notifies user when profile data changes.

## How to use

1. Install n8n locally:  `npx n8n`
2. Import the workflow `.json` files from this folder via n8n's web UI.
3. Set webhook URLs in `.env` under `N8N_WEBHOOK_URL`.

## Security Note
All webhooks must require `Authorization: Bearer <token>` headers. Never expose unauthenticated webhook endpoints.
