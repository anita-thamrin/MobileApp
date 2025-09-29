# Complain King App
## Mobile Complaint Management System

**Version:** 1.0.0  
**Platform:** iOS & Android  
**Technology:** React Native with Expo SDK 54

---

## Executive Summary

Complain King is a mobile application that streamlines the process of reporting issues to authorities by combining photo evidence, automatic location detection, and direct email communication into a single, user-friendly interface.

---

## Problem Statement

**Current Challenges:**
- Citizens struggle to report issues to appropriate authorities
- Lack of photo evidence weakens complaints
- Location information is often missing or inaccurate
- No centralized system to manage multiple authority contacts
- Complex multi-step processes discourage reporting

**Our Solution:**
A mobile app that captures photo evidence, auto-detects location, and sends structured complaints to authorities via email in under 2 minutes.

---

## Key Features

### 1. Camera Integration
- Real-time camera preview with front/back switching
- High-quality photo capture for evidence
- Automatic permission handling
- Works on both iOS and Android

### 2. Automatic Location Detection
- GPS coordinate capture with accuracy
- Reverse geocoding for readable addresses
- Visual location display on camera screen
- Embedded location data in complaints

### 3. Email to Authorities
- Direct email composition with attachments
- Multiple recipient selection
- Professional email formatting
- Photo and location data automatically included

### 4. Authority Management
- Add, edit, and delete authority contacts
- Category-based organization (Municipal, Safety, Infrastructure, etc.)
- Email validation
- Persistent local storage with AsyncStorage

---

## Technical Architecture

### Frontend
**Framework:** React Native 0.81.4  
**UI Library:** React Native Paper 5.14.5  
**Navigation:** React Navigation 7.x (Stack Navigator)

### State Management
- React Hooks (useState, useEffect, useRef)
- AsyncStorage for persistent data
- Local state management (no Redux needed)

### Core Dependencies
```
expo: ~54.0.0
expo-camera: ~17.0.8
expo-location: ~19.0.7
expo-mail-composer: ~15.0.7
@react-navigation/native: ^7.1.17
@react-navigation/stack: ^7.4.8
react-native-paper: ^5.14.5
@react-native-async-storage/async-storage: ~2.2.0
```

### Project Structure
```
complain-king-app/
├── src/
│   └── screens/
│       ├── HomeScreen.js          (Dashboard)
│       ├── CameraScreen.js        (Camera + Location)
│       ├── ComplaintScreen.js     (Form + Email)
│       └── AuthoritiesScreen.js   (CRUD Management)
├── App.js                         (Navigation Setup)
└── app.json                       (Configuration)
```

---

## User Flow

### Submitting a Complaint (< 2 minutes)

1. **Open App** → Home screen with quick actions
2. **Tap "Take Photo & Report"** → Camera opens
3. **Auto Location Detection** → GPS coordinates captured automatically
4. **Capture Photo** → High-quality image saved
5. **Write Complaint** → Subject + detailed description
6. **Select Authorities** → Choose from pre-configured list
7. **Submit** → Email sent with photo and location

### Managing Authorities (< 1 minute)

1. **Navigate to Authorities Screen**
2. **Tap + Button** → Add new authority
3. **Enter Details** → Name, email, category
4. **Save** → Stored locally on device

---

## Technical Highlights

### Camera Implementation
- Uses new Expo Camera SDK 54 API (`CameraView` component)
- Modern permission handling with `useCameraPermissions()` hook
- Async photo capture with quality settings
- Proper cleanup and error handling

### Location Services
- `expo-location` for GPS and geocoding
- Permission request flow
- Reverse geocoding for human-readable addresses
- Coordinate formatting with 6 decimal precision

### Email Integration
- `expo-mail-composer` for native email composition
- Automatic attachment handling
- Cross-platform support (iOS Mail / Android Gmail)
- Graceful fallback when mail unavailable

### Data Persistence
- AsyncStorage for authority database
- JSON serialization
- Default authorities pre-populated
- CRUD operations with validation

---

## Challenges & Solutions

### Challenge 1: Camera API Migration
**Problem:** Expo SDK 54 deprecated old Camera API  
**Solution:** Migrated to new `CameraView` component with hooks-based permissions

### Challenge 2: Location Permission Handling
**Problem:** Different permission models on iOS vs Android  
**Solution:** Unified permission flow using expo-location with proper error handling

### Challenge 3: Email Composition
**Problem:** Email unavailable on simulators  
**Solution:** Added availability check with user-friendly error messages

### Challenge 4: Dependency Conflicts
**Problem:** npm peer dependency issues during installation  
**Solution:** Used `--legacy-peer-deps` flag and Expo-managed installation

### Challenge 5: Android Emulator Issues
**Problem:** App crashes on Android emulator but works on iOS  
**Solution:** Identified emulator-specific issues; works on real Android devices

---

## Security & Privacy

### Permissions Required
- **Camera:** Photo capture for evidence
- **Location:** GPS coordinates for complaints
- **Storage:** Saving photos temporarily

### Data Handling
- All data stored locally on device
- No cloud storage or external servers
- Email sent through device's native mail app
- User controls all data sharing

### Privacy Considerations
- Location data only captured when taking photo
- No tracking or analytics
- No user accounts or authentication required
- Authority emails configurable by user

---

## Testing

### Platforms Tested
- iOS (iPhone - Physical Device) ✅
- Android (Pixel Emulator) ⚠️ Performance issues
- Android (Real Device) ✅

### Test Scenarios
- Camera permission flow
- Location detection accuracy
- Email composition with attachments
- Authority CRUD operations
- Navigation between screens
- Form validation
- Error handling

### Known Issues
- Android emulator may have performance issues
- iOS Simulator doesn't support mail composition
- Location detection requires outdoor environment for best accuracy

---

## Performance Metrics

### App Size
- APK Size: ~50MB (with Expo Go)
- IPA Size: ~45MB

### Load Times
- Initial app load: < 2 seconds
- Camera ready: < 1 second
- Location detection: 2-5 seconds (depending on GPS)
- Email composition: Instant

### Code Statistics
- Total Lines of Code: ~973
- Number of Components: 4 screens
- Third-party Dependencies: 14 main packages
- Development Time: ~1 week

---

## Future Enhancements

### Phase 2 Features
1. **Complaint History**
   - Local database of submitted complaints
   - Status tracking
   - Search and filter functionality

2. **Multiple Photos**
   - Capture multiple evidence photos
   - Photo gallery picker
   - Image compression

3. **Voice Notes**
   - Audio recordings for complaints
   - Voice-to-text transcription

4. **Templates**
   - Pre-written complaint templates
   - Category-specific formats

### Phase 3 Features
1. **User Accounts**
   - Cloud sync across devices
   - Complaint history backup

2. **Authority Response Tracking**
   - Mark complaints as resolved
   - Follow-up reminders
   - Response notifications

3. **Community Features**
   - Share complaints anonymously
   - Upvote important issues
   - Heat map of reported problems

4. **Analytics Dashboard**
   - Complaint statistics
   - Response times by authority
   - Issue trends

---

## Business Model (Optional)

### Free Version
- Basic complaint submission
- Up to 3 authorities
- Limited to 10 complaints/month

### Premium Version ($4.99/month)
- Unlimited complaints
- Unlimited authorities
- Cloud backup
- Priority support

### Enterprise Version ($49.99/month)
- Multi-user support
- Custom branding
- Advanced analytics
- API access

---

## Installation & Deployment

### Development Setup
```bash
git clone [repository]
cd complain-king-app
npm install
npx expo start
```

### Testing
```bash
npx expo-doctor        # Verify setup
npx expo start --clear # Clear cache
npm run android        # Test on Android
npm run ios            # Test on iOS
```

### Production Build
```bash
eas build --platform ios     # iOS build
eas build --platform android # Android build
eas submit                   # Submit to stores
```

---

## Conclusion

### Key Achievements
- Built fully functional cross-platform mobile app
- Integrated camera, location, and email services
- Created intuitive user interface with Material Design
- Implemented proper error handling and validation
- Achieved working iOS deployment

### Lessons Learned
- Expo SDK migrations require careful API updates
- Android emulator testing has limitations
- Real device testing is essential
- User experience design is critical for adoption

### Impact
Complain King simplifies civic engagement by reducing complaint submission time from 15+ minutes to under 2 minutes, making it easier for citizens to report issues and hold authorities accountable.

---

## Demo

**Live Demo Available:**
- iOS Device: Fully functional
- Android Device: Fully functional  
- GitHub Repository: [link]
- Video Demo: [link]

**Contact:**
[Your Name]  
[Your Email]  
[Your GitHub]

---

## Questions?

Thank you for your attention!

**Try it yourself:**
Scan QR code to test on your device
(Demo available via Expo Go)