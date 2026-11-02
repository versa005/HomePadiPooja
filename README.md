# Home Padi Pooja Invitation
A reusable invitation hosted on GitHub Pages. Edit event details at `?admin=1`, preview, download `event.json`, and commit the new file to the repository. The editor is public and does not save to GitHub automatically.
## Publish
In repository Settings > Pages choose Deploy from a branch, main, /(root). The published URL is https://versa005.github.io/HomePadiPooja/.
## Enable RSVP
Create a private Google Sheet, open Extensions > Apps Script, paste Code.gs, save, then Deploy > New deployment > Web app (Execute as Me; access Anyone). Copy the /exec URL into the editor's Apps Script field, download event.json, and commit it. Test a response and confirm a row appears in the RSVPs sheet before sharing.
## Important
RSVPs are NOT saved until Apps Script is deployed and configured. The browser uses a no-cors request and cannot confirm server success; check the Sheet. This endpoint has no authentication or spam protection. Keep the Sheet private and do not put secrets in event.json. Each new event should have a unique eventId. RSVP counts are available in Google Sheets, not the public webpage.