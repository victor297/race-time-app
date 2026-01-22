# Strava OAuth Troubleshooting Guide

## Problem: "Strava connection failed" Error

### Possible Causes & Solutions

#### 1. **Redirect URI Mismatch**

**Symptom:** OAuth flow fails immediately after authorization

**Solution:** Ensure the redirect URI in your Strava app settings matches exactly:

1. Go to https://www.strava.com/settings/api
2. Find your app (Client ID: 175936)
3. Check "Authorization Callback Domain"
4. Should be set to: `myracetime://strava`

**Important:** The scheme in `app.json` must match:

```json
{
  "expo": {
    "scheme": "myracetime"
  }
}
```

#### 2. **App Not Registered for Deep Linking**

**Symptom:** Browser opens but doesn't redirect back to app

**Solution:**

**For Development:**

```bash
# Restart the development server
npx expo start --clear

# If using iOS simulator
npx expo start --ios

# If using Android emulator
npx expo start --android
```

**For Production:**

- Rebuild the app after adding the `scheme` to `app.json`
- For EAS builds:
  ```bash
  eas build --profile development --platform ios
  eas build --profile development --platform android
  ```

#### 3. **Invalid Credentials**

**Symptom:** Token exchange fails with 401/403 error

**Solution:** Verify credentials in `.env`:

```env
EXPO_PUBLIC_STRAVA_CLIENT_ID=175936
EXPO_PUBLIC_STRAVA_CLIENT_SECRET=a51ae6dba36821559a6a0f27e5d95807ca928b09
```

Check these match your Strava API app settings.

#### 4. **User Cancelled Authorization**

**Symptom:** Error message: "Authorization was cancelled"

**Cause:** User clicked "Cancel" or closed the browser

**Solution:** This is normal - user needs to try again and approve the connection.

#### 5. **Network/CORS Issues**

**Symptom:** Token exchange request fails

**Debug Steps:**

1. Check console logs for the exact error
2. Verify internet connection
3. Try on a different network

#### 6. **expo-web-browser Not Configured**

**Symptom:** Browser doesn't open or app crashes

**Solution:**

```bash
npx expo install expo-web-browser
```

Ensure it's in the plugins list in `app.json`:

```json
{
  "plugins": ["expo-web-browser"]
}
```

## Debugging

### Enable Console Logs

The updated `fitnessAppAuth.ts` now includes detailed logging:

```typescript
console.log("Strava OAuth Configuration:", { clientId, redirectUri, scopes });
console.log("Opening Strava auth URL:", authUrl);
console.log("Strava OAuth result:", result);
```

### Check Logs

**Development:**

- Watch Metro bundler console for logs
- Check device logs via `adb logcat` (Android) or Xcode console (iOS)

**What to Look For:**

```
✅ Good: result.type === "success"
❌ Bad: result.type === "dismiss" or "cancel"
```

### Test Flow Step-by-Step

1. **Verify Configuration**

   ```typescript
   console.log(Constants.fitnessApps.strava);
   // Should show: { clientId: "175936", clientSecret: "...", redirectUri: "myracetime://strava" }
   ```

2. **Test Deep Link**

   ```bash
   # iOS
   xcrun simctl openurl booted myracetime://strava

   # Android
   adb shell am start -W -a android.intent.action.VIEW -d "myracetime://strava"
   ```

   App should open - if not, deep linking isn't configured.

3. **Manual OAuth Test**
   Open this URL in a browser:

   ```
   https://www.strava.com/oauth/authorize?client_id=175936&response_type=code&redirect_uri=myracetime://strava&approval_prompt=force&scope=activity:read_all
   ```

   After approval, should redirect to: `myracetime://strava?code=XXXXX`

## Strava API Setup Checklist

- [ ] Created app at https://www.strava.com/settings/api
- [ ] Client ID matches `.env` (175936)
- [ ] Client Secret matches `.env`
- [ ] Authorization Callback Domain set to `myracetime://strava`
- [ ] App icon uploaded (required by Strava)
- [ ] App description filled out
- [ ] Requested appropriate scopes: `activity:read_all`

## Common Error Messages

### "No authorization code received"

- OAuth redirected but no `code` parameter in URL
- Check redirect URI configuration
- Verify URL parsing logic

### "Failed to exchange code for token"

- Strava API rejected the code exchange
- Check client secret is correct
- Code may have expired (use within 10 minutes)
- Code can only be used once

### "No access token in response"

- Token exchange succeeded but malformed response
- Check network response in logs
- Verify Strava API is operational

## Testing Recommendations

1. **Start Fresh:**

   ```bash
   # Clear app data
   # iOS: Delete app and reinstall
   # Android: Settings > Apps > My Racetime > Clear Data

   # Restart dev server
   npx expo start --clear
   ```

2. **Test on Real Device:**
   - Deep linking works more reliably on physical devices
   - Use Expo Go for quick testing:
     ```bash
     npx expo start --tunnel
     ```

3. **Check Strava API Status:**
   - Visit https://status.strava.com/
   - Check for any ongoing incidents

## Next Steps After Fix

Once Strava connection works:

1. **Test Activity Fetching:**
   - Go to RaceDetails screen
   - Click "Add" → Select Strava
   - Verify activities are fetched

2. **Test Activity Submission:**
   - Ensure activities are posted to backend
   - Check network tab for `POST /v2/races`
   - Verify payload format

3. **Implement Other Apps:**
   - Google Fit
   - Fitbit
   - Apple Health
   - Samsung Health

## Support

If issues persist:

1. Check console logs for detailed error messages
2. Verify all configuration steps above
3. Test with a fresh Strava account
4. Review Strava's OAuth documentation: https://developers.strava.com/docs/authentication/
