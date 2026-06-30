# Disaster Recovery & Operations Runbook

This document contains step-by-step operational instructions (runbooks) for managing critical system failures, data recovery, and security incident responses for the Chronos platform.

---

## 1. Database Recovery: Point-in-Time Recovery (PITR) on Neon

Neon Postgres automatically takes continuous backups, allowing you to restore the database state to any specific microsecond within your retention window (default: 7 days).

### Runbook: Restoring to a Specific Time

If a corrupt database migration or accidental deletion occurs, follow these steps:

1. **Identify the Target Timestamp**:
   * Determine the exact UTC time *just before* the incident occurred (e.g., `2026-06-29T21:40:00Z`).
2. **Create a New Branch in Neon**:
   * Navigate to the **Neon Console** -> **Branches**.
   * Click **Create Branch**.
   * Choose **Point in Time** as the restore source.
   * Select the parent branch (usually `main`) and input the target timestamp.
   * Name the branch (e.g., `recovery-20260629`).
3. **Verify the Restored Data**:
   * Obtain the connection string for the new `recovery-20260629` branch.
   * Connect via pgAdmin, DBeaver, or run a test server using this connection string to verify the data is intact.
4. **Switch the Active Database**:
   * Update the `DATABASE_URL` environment variable in Vercel to point to the new branch's connection string.
   * Redeploy the application or restart the server.
5. **Promote the Branch (Optional)**:
   * In the Neon Console, you can promote the recovery branch to be the new `main` branch.

---

## 2. Next.js / Frontend Rollback on Vercel

If a broken deployment passes CI/CD but causes production issues, Vercel allows instant, zero-downtime rollbacks.

### Runbook: Reverting to a Previous Deployment

1. **Open Vercel Dashboard**:
   * Navigate to the Chronos project dashboard.
2. **Select Deployments Tab**:
   * Locate the last known stable deployment (it will have a green `Ready` status and a timestamp prior to the break).
3. **Trigger Rollback**:
   * Click the three dots `...` next to the stable deployment.
   * Click **Instant Rollback**.
   * Confirm the rollback.
4. **Traffic Re-routing**:
   * Vercel will instantly re-route 100% of production traffic to the selected deployment's edge nodes. This takes less than 2 seconds.

---

## 3. Compromised Secrets Rotation

If an API key or database password is leaked, it must be rotated immediately.

### Runbook: Secret Rotation Flow

1. **Revoke the Leaked Key**:
   * Go to the provider (e.g., Supabase, Neon, GitHub) and revoke/delete the leaked credential.
2. **Generate a New Key**:
   * Generate a new secure token or password from the provider.
3. **Update Vercel Environment Variables**:
   * Go to **Vercel Console** -> **Settings** -> **Environment Variables**.
   * Edit the compromised variable (e.g., `DATABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) and input the new value.
   * Click **Save**.
4. **Redeploy to Apply Changes**:
   * Since Next.js embeds environment variables at build time, you **must** trigger a new deployment for the changes to take effect:
     ```bash
     vercel --prod --force
     ```
     Or trigger a redeploy from the Vercel dashboard.
