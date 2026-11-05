# AWS Amplify Hosting Deployment Guide

This guide walks you through deploying the **PARKWISE** frontend application directly onto **AWS Amplify Hosting**.

---

## 1. Overview

PARKWISE is architected as a pure client-side Single Page Application (SPA) built with React, Vite, and Tailwind CSS. The root configuration file `amplify.yml` specifies `frontend` as the `appRoot` so Amplify builds the application from the correct subfolder without requiring a backend server.

---

## 2. Step-by-Step Deployment Instructions

### Step 1: Push Your Code to Git
Initialize Git in your project root (if not already done) and push to GitHub, GitLab, or AWS CodeCommit:

```bash
git init
git add .
git commit -m "Initial commit of PARKWISE frontend application"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

### Step 2: Open the AWS Amplify Console
1. Log in to the [AWS Management Console](https://console.aws.amazon.com/).
2. In the top search bar, type **Amplify** and navigate to **AWS Amplify**.
3. In the left navigation, click **All apps**, then click **New app > Host web app**.

### Step 3: Connect Git Repository
1. Select your Git provider (e.g., **GitHub**).
2. Authorize AWS Amplify to access your repository.
3. Select your repository name and choose the branch to deploy (e.g., `main`).
4. Click **Next**.

### Step 4: Verify Build Settings
AWS Amplify will automatically detect the `amplify.yml` file located in the root directory:

```yaml
version: 1
applications:
  - appRoot: frontend
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: dist
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
```

- Verify that **App root** is set to `frontend`.
- Verify that **Base directory** is set to `dist`.
- Click **Next**.

### Step 5: Review and Deploy
1. Review all repository details, branch, and build configuration.
2. Click **Save and deploy**.
3. Amplify will provision the build container, run `npm ci` and `npm run build`, and deploy the contents of `frontend/dist/` to high-availability global CDN edge locations.

---

## 3. Critical Step: Configure SPA Rewrites & Redirects

Single Page Applications using React Router handle route changes client-side. When a user directly visits a deep route (such as `https://<your-amplify-id>.amplifyapp.com/dashboard` or `/admin/reservations`) or refreshes the page, the web server must serve `index.html` rather than returning a 404 error.

### How to configure the rewrite:
1. In the AWS Amplify Console, click into your app.
2. In the left navigation sidebar under **App settings**, click **Rewrites and redirects**.
3. Click **Edit**.
4. Add the following rule or modify the default rule:

| Source address | Target address | Type | Country code |
|---|---|---|---|
| `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>` | `/index.html` | `200 (Rewrite)` | Leave empty |

5. Click **Save**.

Now, all routes (including `/login`, `/dashboard`, `/parking/zone-a`, `/booking/review`, and `/admin/*`) will load smoothly without 404s.

---

## 4. Continuous Deployment (CI/CD)

Whenever you commit and push new code to your connected Git branch:
```bash
git add .
git commit -m "Update parking telemetry features"
git push origin main
```
Amplify will automatically trigger a new build, execute the test and build phases, and roll out the update with zero downtime.

---

## 5. Verification Checklist Post-Deployment

After your deployment completes:
- [ ] Open the provided `amplifyapp.com` URL.
- [ ] Confirm the Landing Page renders the live available slots counter.
- [ ] Click **Sign In** and log in with `customer@parkwise.demo` / `Parkwise123!`.
- [ ] Navigate through **Find Parking** > **Interactive Bay Blueprint** (`/parking/zone-a`).
- [ ] Select an available slot (e.g. `Bay A-14`) and proceed to **Booking Review**.
- [ ] Click **Confirm Reservation** and verify the confirmed digital pass displays with reference `#PW-xxxx`.
- [ ] Log in with `admin@parkwise.demo` / `Parkwise123!` and verify the **Admin Operations Command Center** displays all KPIs, donut chart, hourly bar chart, and reservation roster.
- [ ] Refresh the browser on `/admin/dashboard` to verify the SPA rewrite rule works.

