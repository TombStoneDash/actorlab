# 🚀 Deploy Actor Lab to Production

## ✅ Pre-Deployment Checklist
- [x] Code is committed to git
- [x] Dev server tested locally (http://localhost:3000)
- [x] Environment variables configured (.env.local)
- [x] All dependencies installed (213 packages)
- [ ] GitHub repository created
- [ ] Vercel project deployed
- [ ] Custom domain configured

---

## 📋 Deployment Steps

### Option 1: Deploy via GitHub (Recommended)

#### Step 1: Create GitHub Repository

**Via GitHub Website:**
1. Go to https://github.com/TombStoneDash
2. Click "New repository"
3. Repository name: `actorlab`
4. Description: "AI-powered tools for professional actors"
5. Public repository
6. **DO NOT** initialize with README (we already have one)
7. Click "Create repository"

**Via Command Line (if you have GitHub CLI):**
```bash
cd /Users/iHud_Mini/TombstoneDash/actorlab
gh repo create TombStoneDash/actorlab --public --source=. --remote=origin
```

#### Step 2: Push Code to GitHub

Copy the commands GitHub provides, or use:
```bash
cd /Users/iHud_Mini/TombstoneDash/actorlab

# Add GitHub as remote (replace YOUR-REPO-URL)
git remote add origin https://github.com/TombStoneDash/actorlab.git

# Push code
git branch -M main
git push -u origin main
```

#### Step 3: Deploy to Vercel via GitHub

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub account
4. Find and import `TombStoneDash/actorlab`
5. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
6. Click "Deploy"

#### Step 4: Add Environment Variables in Vercel

After deployment starts:
1. Go to your project settings
2. Click "Environment Variables"
3. Add these variables for **Production**:

```env
OPENAI_API_KEY=<your-openai-key-from-.env.local>
NEXT_PUBLIC_BASE_URL=https://actorlab.tombstonedash.com
NODE_ENV=production
```

**Optional (for Pro features):**
```env
STRIPE_SECRET_KEY=<your-stripe-key>
STRIPE_PRICE_ID=<your-price-id>
STRIPE_WEBHOOK_SECRET=<your-webhook-secret>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-publishable-key>
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

4. Click "Save"
5. Redeploy the project

#### Step 5: Configure Custom Domain

1. In Vercel project settings, go to "Domains"
2. Click "Add Domain"
3. Enter: `actorlab.tombstonedash.com`
4. Vercel will provide DNS configuration:
   - **Type**: CNAME
   - **Name**: actorlab
   - **Value**: cname.vercel-dns.com
5. Add this CNAME record to your DNS provider (where tombstonedash.com is hosted)
6. Wait for DNS propagation (5-60 minutes)
7. Vercel will automatically provision SSL certificate

---

### Option 2: Deploy via Vercel CLI

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
cd /Users/iHud_Mini/TombstoneDash/actorlab

# First deployment (will ask configuration questions)
vercel

# Add environment variables
vercel env add OPENAI_API_KEY production
vercel env add NEXT_PUBLIC_BASE_URL production
vercel env add NODE_ENV production

# Deploy to production
vercel --prod
```

#### Step 4: Add Custom Domain
```bash
vercel domains add actorlab.tombstonedash.com
```

---

## 🧪 Post-Deployment Testing

### Test These URLs (after deployment):

1. **Landing Page**
   ```bash
   curl https://actorlab.tombstonedash.com
   ```

2. **Health API**
   ```bash
   curl https://actorlab.tombstonedash.com/api/health
   ```

3. **Tools Dashboard**
   - Visit: https://actorlab.tombstonedash.com/lab

4. **Resume Generator**
   - Visit: https://actorlab.tombstonedash.com/lab/resume-coverletter

5. **Test AI API**
   ```bash
   curl -X POST https://actorlab.tombstonedash.com/api/generate-resume-cover \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","roleType":"Film","experience":"5"}'
   ```

---

## 🔧 Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all dependencies in package.json
- Verify Node.js version (should auto-detect)

### Environment Variables Not Working
- Redeploy after adding env vars
- Check variable names (case-sensitive)
- Verify values are correct (no quotes needed in Vercel UI)

### Domain Not Working
- Check DNS propagation: https://dnschecker.org
- Verify CNAME record is correct
- Wait 5-60 minutes for DNS to propagate
- Check domain status in Vercel dashboard

### API Errors
- Check OpenAI API key is valid
- Check API rate limits
- Review function logs in Vercel dashboard

---

## 🎯 Success Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Vercel project deployed
- [ ] Environment variables added
- [ ] Production deployment successful
- [ ] Custom domain configured
- [ ] DNS propagated
- [ ] SSL certificate active
- [ ] Landing page loads
- [ ] API health check works
- [ ] AI tools functional
- [ ] No console errors

---

## 📊 Expected Build Output

```
✓ Linting and checking validity of types
✓ Creating an optimized production build
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages (5/5)
✓ Finalizing page optimization
```

**Build time**: ~2-3 minutes
**Function count**: 10 API routes
**Output size**: ~500KB - 1MB

---

## 🌐 Live URLs (After Deployment)

### Pages:
- Landing: https://actorlab.tombstonedash.com
- Dashboard: https://actorlab.tombstonedash.com/lab
- Resume Tool: https://actorlab.tombstonedash.com/lab/resume-coverletter
- Scene Partner: https://actorlab.tombstonedash.com/lab/scene-partner

### APIs:
- Health: https://actorlab.tombstonedash.com/api/health
- AI Tools: https://actorlab.tombstonedash.com/api/*
- Stripe: https://actorlab.tombstonedash.com/api/*

---

## 🔄 Continuous Deployment

After initial setup, Vercel will automatically deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel automatically deploys!
```

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Support**: dev@tombstonedash.com

---

**Ready to go live! 🚀**
