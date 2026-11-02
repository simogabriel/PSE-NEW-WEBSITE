# Careers backend setup and operation

The Careers UI calls the same-origin Vercel API in `/api`. Listings and push subscriptions are stored in Upstash Redis. The static `opportunities.json` file is only a local-preview fallback.

## One-time deployment setup

1. Create an Upstash Redis database and connect it to the linked `pse-consulting` Vercel project. Add its REST URL and token as `KV_REST_API_URL` and `KV_REST_API_TOKEN` in Vercel Project Settings > Environment Variables.
2. Generate Web Push application keys with `npx web-push generate-vapid-keys`. Set the generated values as `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY`. Set `VAPID_SUBJECT` to a contact such as `mailto:info@pse-consulting.com`.
3. Set `CAREERS_ADMIN_TOKEN` to a long, random secret. Do not commit the secret or enter it in the public website.
4. Install the project dependency with `npm install`, then deploy the project to Vercel. The API routes and static pages deploy together, so the browser uses same-origin requests.

The environment variable names and placeholders are listed in `.env.example`. Configure real values in Vercel, not in the checked-in example. After changing environment variables, redeploy.

## Publishing jobs

Open `/career-admin.html`, enter `CAREERS_ADMIN_TOKEN`, and select **Load listings**. Use the form to add or edit bilingual positions. Use **Publish changes** to update public listings. Closing a role removes it from the published list. Publishing a role with a previously unused ID sends a Web Push notification to active subscriptions.

Each position needs a unique ID containing letters, numbers, hyphens, or underscores; English and French titles, type labels, and summaries; a location; and an application URL. Closing date is optional. Keep the same ID when editing a role.

## Visitor notifications

Visitors choose **Turn on alerts** on `career.html` and grant browser permission. The website registers a service worker, stores the push subscription in Redis, and receives push notifications when a new job is published. Notifications can arrive while the Careers page is closed, subject to the visitor's browser and device settings. The browser must support Web Push and the website must be served over HTTPS.

No email service is configured. Push delivery is used for job alerts.
