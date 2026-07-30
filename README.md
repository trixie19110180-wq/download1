# Download1

A small static download page for a Scratch 3 project.

## Deploy to Render

1. Create a GitHub repository and upload everything in this folder.
2. In the Render Dashboard, choose **New > Blueprint**.
3. Connect the GitHub repository and deploy the `download1` service.
4. If the name is available, the site will use `https://download1.onrender.com`.

Render will automatically redeploy the site whenever the connected branch changes.

## Manual Static Site setup

If you create a Render Static Site instead of using the Blueprint, use:

- Build Command: `echo "Static site ready"`
- Publish Directory: `site`
