Using the Render manifest
------------------------

1. Replace `<YOUR_GITHUB_USER_OR_ORG>/REPO_NAME` in `render.yaml` with your repository path.
2. Commit and push. In the Render dashboard, import this repo and Render will read the manifest.
3. The manifest provisions a managed Postgres (`wareflow-db`) and a web service (`wareflow-backend`).
4. Render sets `DATABASE_URL` automatically for the web service from the managed Postgres.
5. Update `SECRET_KEY` in the dashboard or via `render.yaml` with a secure value.

Notes:
- Change `plan` and `region` to match your preferences.
- For more complex deploy steps, modify `buildCommand` and `startCommand`.
