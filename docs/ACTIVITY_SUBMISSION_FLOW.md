# Activity Submission Flow - Implementation Summary

## Overview

Implemented complete activity submission flow allowing users to pull activities from connected fitness apps and submit them to race events.

## Flow Diagram

```
User clicks "Add" →
  Actionsheet shows app list →
    User selects app →
      Check if connected →
        If NOT connected: Show alert →
        If connected: Fetch activities from app API →
          Map activities to backend format →
            Submit to backend (v2/races) →
              Refresh race stats & activities
```

## Implementation Details

### 1. **Activity Fetching Service** (`src/services/fitnessApps/fetchActivities.ts`)

Created service to fetch activities from each fitness app:

- ✅ **Strava**: Fully implemented
  - Endpoint: `https://www.strava.com/api/v3/athlete/activities`
  - Uses stored OAuth token
  - Supports date range filtering
  - Returns normalized `ApiActivityDto[]`

- ⏳ **Google Fit**: Placeholder (needs implementation)
- ⏳ **Fitbit**: Placeholder (needs implementation)
- ⏳ **Samsung Health**: Requires native SDK
- ⏳ **Apple Health**: Requires native HealthKit

### 2. **RaceDetails Screen Updates**

**New Features:**

- Loads app connection status on mount
- Shows actionsheet with app list when "Add" is clicked
- Displays connection status for each app (green = connected, gray = not connected)
- Submit button enabled only for connected apps

**Submit Flow:**

1. Check if app is connected
2. If not connected: Show alert with option to navigate to Connect Apps
3. If connected:
   - Show "Fetching Activities" toast
   - Call `fetchActivitiesFromApp(appId)`
   - Show "Submitting" toast with count
   - Post to `v2/races` with event ID
   - Refresh race data on success

**Payload Format:**

```typescript
[
  {
    id: "strava:1234567890",
    externalId: "1234567890",
    source: "strava",
    name: "Morning Run",
    type: "running",
    dateUtc: "2025-11-09T05:00:00Z",
    dateLocal: "2025-11-09T06:00:00Z",
    distanceKm: 10.5,
    movingTimeSec: 3600,
    elapsedTimeSec: 3720,
    averageSpeedKmh: 10.5,
    pacePerKm: 5.7,
    elevationGainM: 150,
    location: {
      city: "Abuja",
      state: "FCT",
      country: "Nigeria",
    },
    routePolyline: "...",
    units: "metric",
    event: "672b345fabcd123456789012",
  },
];
```

### 3. **Activity Mapping**

Used existing mapping services:

- `mapStravaToActivity()` - Maps Strava API response to `ApiActivityDto`
- `normalizeApiActivity()` - Routes to correct mapper based on source
- All mappers in `src/services/api/map/` directory

### 4. **Environment Variables** (`.env`)

Currently configured:

```env
# Strava (Working)
EXPO_PUBLIC_STRAVA_CLIENT_ID=175936
EXPO_PUBLIC_STRAVA_CLIENT_SECRET=a51ae6dba36821559a6a0f27e5d95807ca928b09
EXPO_PUBLIC_STRAVA_REDIRECT_URI=myracetime://strava

# Placeholders (Add when ready)
EXPO_PUBLIC_GOOGLE_FIT_CLIENT_ID=...
EXPO_PUBLIC_FITBIT_CLIENT_ID=...
EXPO_PUBLIC_SAMSUNG_HEALTH_CLIENT_ID=...
```

## Testing Checklist

### Strava (Ready to Test)

- [ ] Connect Strava account via Connect Apps screen
- [ ] Go to RaceDetails screen
- [ ] Click "Add" button
- [ ] Select Strava from list
- [ ] Verify activities are fetched and submitted
- [ ] Check activities appear in race details

### Future Apps (Needs Implementation)

- [ ] Google Fit - Implement OAuth & API calls
- [ ] Fitbit - Implement OAuth & API calls
- [ ] Samsung Health - Native SDK integration
- [ ] Apple Health - Native HealthKit integration

## Error Handling

**App Not Connected:**

```
Alert: "App Not Connected"
Message: "Strava is not connected. Please connect it in the Connect Apps screen first."
Actions: [Cancel, Go to Connect Apps]
```

**No Activities Found:**

```
Alert: "No Activities"
Message: "No activities found in Strava."
```

**API Error:**

```
Toast: "Submission Failed"
Message: {error.message}
```

**Connection Error:**

```
Alert: "Error"
Message: "Failed to fetch activities from the app"
```

## User Experience

1. **Visual Feedback:**
   - Loading spinner during fetch & submit
   - Toast messages for each step
   - Connection status badges (green/gray)
   - Disabled buttons for disconnected apps

2. **Progress Updates:**
   - "Fetching Activities..." (with app name)
   - "Submitting X activities..."
   - "Success! X activities submitted"

3. **Graceful Failures:**
   - Clear error messages
   - Actionable suggestions
   - No data loss

## Backend Contract

**Endpoint:** `POST /api/v2/races`

**Expected Payload:**

```typescript
ApiActivityDto[] // Array of activities with event field
```

**Query Keys Invalidated on Success:**

- `my_race_activity_details_${eventId}`
- `event_race_stats_${eventId}`

This ensures the UI automatically refreshes with new data.

## Next Steps

1. **Test Strava Integration:**
   - Ensure OAuth connection works
   - Verify activity fetching
   - Test submission to backend

2. **Implement Other Apps:**
   - Google Fit: Use `expo-auth-session` for OAuth
   - Fitbit: Similar to Strava OAuth flow
   - Samsung Health: Research React Native SDK
   - Apple Health: Integrate `react-native-health`

3. **Enhancements:**
   - Date range picker for activity filtering
   - Activity preview before submission
   - Duplicate detection
   - Manual activity entry as fallback
   - Progress indicator for large syncs

4. **Production Readiness:**
   - Add retry logic for failed requests
   - Implement token refresh flows
   - Add analytics tracking
   - Handle rate limiting
   - Add offline support

## File Changes Summary

**New Files:**

- `src/services/fitnessApps/fetchActivities.ts` - Activity fetching logic

**Modified Files:**

- `src/screens/profile/RaceDetails.tsx` - Submit flow implementation
- `src/services/fitnessApps/index.ts` - Export fetchActivities
- `.env` - Strava credentials added

**Unchanged (Used):**

- `src/services/api/map/strava.ts` - Activity mapping
- `src/services/api/map/normalizeApiActivity.ts` - Mapper router
- `src/types/dto/api/apiActivity.dto.ts` - Type definitions
- `src/services/api/apps.ts` - App list configuration
