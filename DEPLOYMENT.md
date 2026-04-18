# RegShield AI — Staging Deployment Guide

## Step 1: Railway Backend Setup
1. Go to railway.app → New Project → Deploy from GitHub repo
2. Select the `/server` directory as root
3. Railway auto-detects Node.js via nixpacks
4. Add PostgreSQL plugin: click "+ New" → Database → PostgreSQL
5. Railway auto-sets `DATABASE_URL` env variable
6. Set these environment variables in Railway dashboard:
   - `JWT_SECRET`=\<generate: `openssl rand -hex 64`\>
   - `JWT_REFRESH_SECRET`=\<generate: `openssl rand -hex 64`\>
   - `FRONTEND_URL`=https://your-app.vercel.app
   - `STAGING_FRONTEND_URL`=https://your-app-git-main.vercel.app
   - `NODE_ENV`=production
   - `PORT`=5000
   - `AWS_REGION`=eu-west-2
   - `AWS_ACCESS_KEY_ID`=\<from AWS IAM\>
   - `AWS_SECRET_ACCESS_KEY`=\<from AWS IAM\>
   - `S3_EVIDENCE_BUCKET`=regshield-evidence-staging
   - `SES_FROM_EMAIL`=noreply@regshield.ai
   - `SES_ADMIN_EMAIL`=info@regshield.ai
   - `STRIPE_SECRET_KEY`=\<from Stripe dashboard\>
   - `STRIPE_WEBHOOK_SECRET`=\<from Stripe dashboard\>
7. Deploy → Railway runs build command automatically
8. After deploy: run seed via Railway CLI:
   `railway run npm run db:seed`
9. Note your Railway URL: `https://regshield-api-xxxx.railway.app`

## Step 2: AWS S3 Setup (for evidence storage)
1. AWS Console → S3 → Create bucket: `regshield-evidence-staging`
2. Region: eu-west-2 (London)
3. Block all public access: YES (required)
4. Enable versioning: YES
5. Server-side encryption: AES-256
6. Create IAM user: `regshield-staging`
7. Attach policy (inline):
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:PutObject","s3:GetObject","s3:DeleteObject"],
    "Resource": "arn:aws:s3:::regshield-evidence-staging/*"
  }]
}
```
8. Generate access keys → add to Railway env vars

## Step 3: Vercel Frontend Setup
1. Go to vercel.com → New Project → Import from GitHub
2. Root directory: `/` (project root, not `/server`)
3. Framework: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add environment variable:
   `VITE_API_URL=https://your-railway-url.railway.app`
7. Deploy
8. Note your Vercel URL → add to Railway `FRONTEND_URL` env var
9. Redeploy Railway after updating env vars

## Step 4: Verify Deployment
Visit your Vercel URL:
- [ ] Home page loads
- [ ] Register a new account
- [ ] Onboarding wizard completes
- [ ] Dashboard shows seeded data
- [ ] Create a test case
- [ ] Upload a test document

Login with seeded accounts:
- `admin@horizonpayments.com` / `Demo1234!`
- `analyst1@horizonpayments.com` / `Demo1234!`

## Step 5: Share with Testing Team
Send your team:
- Vercel staging URL
- Login credentials for all 5 seeded user roles
- Note: "Evidence upload requires AWS S3 — if not configured, upload will fail gracefully"
