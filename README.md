# Asher's 10K Quest Tracker

A small iPad-friendly React/Vite web app for tracking Asher's Rock 'n' Roll San Jose 10K training.

## What it does

- Shows the current week's 10K training plan
- Lets Asher log runs: date, miles, time, run type, feeling, and notes
- Tracks total miles, longest run, and number of runs logged
- Shows progress toward 6.2 miles
- Unlocks simple running badges
- Stores run data in the browser using localStorage

## Important storage note

This first version stores data on the device/browser that Asher uses.

Data should stay there if he closes Safari and reopens the site on the same iPad. Data will not automatically sync to your device, and it can be deleted if Safari website data is cleared.

## Deploy to Vercel using GitHub

1. Unzip this folder.
2. Create a free GitHub account or use your existing one.
3. Create a new GitHub repository named `ashers-10k-quest`.
4. Upload all files from this folder into that repository.
5. Go to Vercel and sign in with GitHub.
6. Click **Add New... → Project**.
7. Import the `ashers-10k-quest` repository.
8. Use these settings:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
9. Click **Deploy**.
10. Copy the Vercel URL and send it to Asher.

## Add to iPad Home Screen

On Asher's iPad:

1. Open the Vercel URL in Safari.
2. Tap the Share icon.
3. Tap **Add to Home Screen**.
4. Name it **10K Quest**.
5. Open it from the Home Screen like an app.

## Local developer commands

```bash
npm install
npm run dev
```

Then open the local URL shown in the terminal.

To create a production build:

```bash
npm run build
```
Deployment trigger.
