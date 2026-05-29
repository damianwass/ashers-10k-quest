# Asher's 10K Quest Tracker

Static no-build version.

## v3 updates

- Combines weekly plan and run logging into one section
- Each planned workout can be marked Incomplete, Complete, or Skipped
- Marking Complete opens the details form for date, time, feeling, and notes
- Removes manual miles entry; mileage is pulled from the planned workout
- Backup Runs, Restore Backup, and Copy Summary remain included

## Deploy on Vercel

Upload only these files to GitHub:

- index.html
- README.md

Vercel settings:

- Framework Preset: Other
- Build Command: blank
- Output Directory: .
- Install Command: blank

## Data storage

Run data is stored in the browser using localStorage on the device where the app is used.
