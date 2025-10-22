# ✅ Build Issues Fixed - Ready for Vercel

## 🐛 Issues Found & Fixed

### 1. Missing TypeScript Path Aliases
**Problem**: API routes using `@/lib/supabaseClient` imports failed
**Solution**: Added path aliases to `tsconfig.json`:
```json
"baseUrl": ".",
"paths": {
  "@/*": ["./*"]
}
```

### 2. Stripe API Version Mismatch
**Problem**: `apiVersion: "2024-04-10"` not recognized by Stripe package
**Solution**: Changed to `"2023-10-16"` in all Stripe API routes:
- `pages/api/create-checkout-session.ts`
- `pages/api/manage-subscription.ts`
- `pages/api/webhook-handler.ts`

### 3. Stripe Billing Portal API Change
**Problem**: `customer_email` parameter no longer accepted
**Solution**: Changed to `customer` (requires customer ID):
```typescript
// Before:
await s.billingPortal.sessions.create({customer_email: email, ...})

// After:
await s.billingPortal.sessions.create({customer: customerId, ...})
```

### 4. Scripts Directory Included in Build
**Problem**: `scripts/seedSupabaseUsers.ts` imported `dotenv` which isn't a dependency
**Solution**: Excluded `scripts` directory from TypeScript compilation in `tsconfig.json`

---

## ✅ Build Verification

### Local Build Test Results:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Generating static pages (12/12)
✓ Finalizing page optimization
```

### Build Output Summary:
- **Pages**: 12 generated (3 static, 9 dynamic)
- **API Routes**: 10 compiled successfully
  - 5 AI tools (App Router)
  - 5 Stripe/system (Pages Router)
- **Middleware**: 26.7 kB compiled
- **Total Bundle Size**: ~96 kB first load

### Routes Compiled:
**App Router (UI):**
- `/` - Landing page
- `/lab` - Tools dashboard
- `/lab/resume-coverletter` - Resume generator
- `/lab/scene-partner` - Scene partner
- `/api/generate-resume-cover` - AI resume API
- `/api/scene-partner` - AI scene partner API
- `/api/character-builder` - Character analysis API
- `/api/analyze-demo-reel` - Demo reel API
- `/api/smart-contact` - Smart contact API

**Pages Router (Services):**
- `/api/health` - Health check
- `/api/create-checkout-session` - Stripe checkout
- `/api/webhook-handler` - Stripe webhooks
- `/api/manage-subscription` - Subscription management
- `/api/user-status` - User status check

---

## 🚀 Ready for Deployment

### All Systems Go:
- ✅ Dependencies installed (213 packages)
- ✅ TypeScript configured correctly
- ✅ Path aliases working
- ✅ Stripe API fixed
- ✅ Supabase client configured
- ✅ Build succeeds locally
- ✅ All routes compiled
- ✅ Middleware working
- ✅ Changes committed to git

---

## 📋 Deployment Checklist

### Step 1: Create GitHub Repository
Option A - Via GitHub Website:
1. Go to https://github.com/TombStoneDash
2. Click "New repository"
3. Name: `actorlab`
4. Public repository
5. Click "Create repository"
6. Copy the remote URL

Option B - Via Command Line (if you have `gh` CLI):
```bash
gh repo create TombStoneDash/actorlab --public --source=. --remote=origin
```

### Step 2: Push Code to GitHub
```bash
# Check current status
git status

# Push to GitHub
git remote add origin https://github.com/TombStoneDash/actorlab.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select `TombStoneDash/actorlab`
4. Framework: Next.js (auto-detected)
5. Click "Deploy"

### Step 4: Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

**Required:**
```
OPENAI_API_KEY=<from-your-.env.local>
NEXT_PUBLIC_BASE_URL=https://actorlab.tombstonedash.com
NODE_ENV=production
```

**Optional (for Pro features):**
```
STRIPE_SECRET_KEY=<your-key>
STRIPE_PRICE_ID=<your-price-id>
STRIPE_WEBHOOK_SECRET=<your-webhook-secret>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-publishable-key>
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-key>
```

### Step 5: Redeploy with Environment Variables
1. Go to Deployments tab
2. Click "Redeploy" on latest deployment
3. Wait for build to complete

### Step 6: Configure Custom Domain
1. Go to Settings → Domains
2. Add domain: `actorlab.tombstonedash.com`
3. Add DNS record (provided by Vercel):
   - Type: CNAME
   - Name: actorlab
   - Value: cname.vercel-dns.com
4. Wait for SSL certificate

---

## 🧪 Testing After Deployment

### Test these endpoints after deployment:
```bash
# Health check
curl https://actorlab.tombstonedash.com/api/health

# Homepage
curl https://actorlab.tombstonedash.com

# Test AI API (requires OPENAI_API_KEY)
curl -X POST https://actorlab.tombstonedash.com/api/generate-resume-cover \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","roleType":"Film","experience":"5"}'
```

### Manual Testing:
- [ ] Visit homepage
- [ ] Click "Enter the Lab"
- [ ] Test Resume Generator tool
- [ ] Test Scene Partner tool
- [ ] Verify all 7 tools show in dashboard
- [ ] Check browser console for errors
- [ ] Test on mobile device

---

## 📊 Expected Vercel Build Output

```
Vercel Build:
✓ Building production bundle
✓ Linting
✓ Type checking
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Build Time: ~2-3 minutes
Output Size: ~96 KB first load
Functions: 10 API routes
Regions: Deployed globally
```

---

## 🎉 Success!

All build issues resolved. Your Actor Lab is ready to deploy to production!

**Git Commits:**
1. Initial build (46 files)
2. Fixed duplicates (10 files changed)
3. **Build fixes (4 files changed)** ← Latest

**Next Step**: Push to GitHub and deploy to Vercel!

---

**Fixed on**: October 22, 2025
**Status**: ✅ Ready for Production
