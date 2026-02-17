# Deployment Guide: Agora Landing Page

This guide walks you through deploying the Agora landing page to Vercel with Supabase for email storage.

## Prerequisites

- GitHub account
- Vercel account (sign up at https://vercel.com)
- Supabase account (sign up at https://supabase.com)

## Step 1: Set Up Supabase

1. **Create a new project** at https://app.supabase.com
   - Choose a project name (e.g., "agora-landing")
   - Set a database password
   - Select a region close to your users

2. **Run the database schema**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase-schema.sql`
   - Paste and run the SQL to create the `email_signups` table

3. **Get your API credentials**
   - Go to Settings → API
   - Copy your **Project URL** (looks like `https://xxxxx.supabase.co`)
   - Copy your **anon/public key** (starts with `eyJ...`)

## Step 2: Push to GitHub

1. **Check your Git remote** (should point to `jerzykultura/agoralanding`):
   ```bash
   git remote -v
   ```

2. **If remote is not set**, add it:
   ```bash
   git remote add origin https://github.com/jerzykultura/agoralanding.git
   ```

3. **Commit and push your changes**:
   ```bash
   git add .
   git commit -m "Add Supabase integration and Vercel configuration"
   git push -u origin main
   ```

## Step 3: Deploy to Vercel

1. **Import your GitHub repository**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select `jerzykultura/agoralanding`

2. **Configure the project**
   - Framework Preset: **Vite**
   - Root Directory: `./` (or `./landing` if repo has multiple folders)
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add environment variables**
   - Click "Environment Variables"
   - Add the following:
     - `VITE_SUPABASE_URL` = Your Supabase Project URL
     - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
   - Make sure to add them for **Production**, **Preview**, and **Development**

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete (usually 1-2 minutes)

## Step 4: Test Your Deployment

1. Visit your deployed site (Vercel will provide a URL like `https://agoralanding.vercel.app`)
2. Scroll to the "Join the Beta" section
3. Enter an email and click "Request Access"
4. Verify the email appears in your Supabase dashboard:
   - Go to Table Editor → `email_signups`

## Step 5: Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to your project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's instructions to update your DNS records

## Automatic Deployments

Now that your project is connected to GitHub:
- Every push to `main` branch will trigger a production deployment
- Pull requests will create preview deployments
- You can view deployment logs in the Vercel dashboard

## Local Development

To run the project locally with Supabase:

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

3. **Add your Supabase credentials** to `.env`

4. **Run the dev server**:
   ```bash
   npm run dev
   ```

The app will run on `http://localhost:5173`

## Troubleshooting

### Build fails on Vercel
- Check that environment variables are set correctly
- Verify the build command is `npm run build`
- Check build logs for specific errors

### Email signups not working
- Verify Supabase credentials in Vercel environment variables
- Check Supabase logs for errors
- Ensure RLS policies are set correctly

### CORS errors
- The serverless function includes CORS headers
- If issues persist, check Vercel function logs

## Monitoring

- **Supabase**: View signups in Table Editor → `email_signups`
- **Vercel**: Monitor deployments and function logs in the dashboard
- **Analytics**: Enable Vercel Analytics in project settings (optional)
