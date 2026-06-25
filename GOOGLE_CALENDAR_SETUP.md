# Google Calendar Integration Setup

This guide explains how to set up Google Calendar integration with the Hausmeister Task Manager.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click "NEW PROJECT"
4. Name it "Hausmeister Task Manager"
5. Click "CREATE"
6. Wait for the project to be created and select it

## Step 2: Enable Google Calendar API

1. In the Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Calendar API"
3. Click on it and press "ENABLE"

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth Client ID"
3. You may see a prompt to configure the OAuth consent screen first:
   - Select "External" as the User Type
   - Click "CREATE"
   - Fill in the required fields (App name: "Hausmeister Task Manager")
   - Add yourself as a test user
   - Save and continue

4. Back in the Credentials page, click "Create Credentials" > "OAuth Client ID"
5. Select "Desktop application" as the Application type
6. Click "CREATE"
7. Copy the **Client ID** and **Client Secret**

## Step 4: Configure Environment Variables

### For Development

Create a `.env.local` file in the project root with:

```
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET
```

Replace `YOUR_CLIENT_ID` and `YOUR_CLIENT_SECRET` with the values from step 3.

### For Production

In your production deployment, set these environment variables in your system or deployment platform.

## Step 5: Run the Application

1. Stop the app if it's running (Ctrl+C)
2. Run `npm run dev`
3. In the Calendar Sync panel on the right sidebar, click "Authorize with Google"
4. Log in with your Google account
5. Grant permission for the app to access your calendar
6. Copy the authorization code shown
7. Paste it into the "Authorization Code" field in the app
8. Click "Submit Code"

## Step 6: Using Calendar Integration

Once authorized:

- Your upcoming calendar events will be displayed in the Calendar Sync panel
- When you create a new task, you can optionally sync it to your Google Calendar
- Task status updates will be reflected in calendar events

## Troubleshooting

### "Invalid Client ID" Error

- Check that your Client ID and Secret are correct
- Make sure you've copied the full Client ID including `.apps.googleusercontent.com`

### "Redirect URI mismatch" Error

- The app uses `urn:ietf:wg:oauth:2.0:oob` (Out-of-Band flow)
- This is a special URI for desktop apps that don't have a web server
- Make sure this is set in your OAuth credentials if needed

### Authorization Code Expires

- Authorization codes are valid for a limited time
- If you see an "invalid_grant" error, go back and re-authorize

### No Calendar Events Showing

- Make sure you've authorized the app
- Check that your Google Calendar has events
- The app shows events from the next 30 days
- Click "Refresh Events" to manually sync

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your Client Secret confidential
- The app stores your refresh token locally for future access
- To revoke access, go to [Google Account Permissions](https://myaccount.google.com/permissions) and remove "Hausmeister Task Manager"

## API Limits

Google Calendar API has rate limits:
- 1,000,000 requests per day per API key
- This should be more than sufficient for personal use

For more information, see [Google Calendar API Quotas](https://developers.google.com/calendar/pricing-and-quotas)
