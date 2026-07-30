# Download1

A small Node.js web service for downloading a Scratch 3 project.

## Create the Render Web Service

In the Render Dashboard, choose **New > Web Service**, connect this repository,
and enter:

- Name: `download1`
- Language: `Node`
- Branch: `main`
- Region: `Oregon (US West)`
- Root Directory: leave blank
- Build Command: `npm install`
- Start Command: `npm start`
- Instance Type: `Free`
- Environment Variables: none required
- Health Check Path under Advanced: `/health`

If the name is available, the site will use `https://download1.onrender.com`.
Render will automatically redeploy it whenever the connected branch changes.

## Run locally

```sh
npm start
```

The server uses Render's `PORT` environment variable and defaults to port
`10000` locally.
