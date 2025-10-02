# Complain King App

## Mobile Complaint Management System

**Version:** 1.0.0 (MVP)  
**Platform:** iOS & Android  
**Technology:** React Native with Expo SDK 51  
**Last Updated:** October 2, 2025

---

## Executive Summary

Complain King is a mobile application that streamlines community issue reporting by combining photo evidence, automatic location detection, and intelligent authority routing into a single, user-friendly interface. Citizens can report neighborhood problems in under 30 seconds, track complaint status in real-time, and ensure their concerns reach the right department.

---

## Problem Statement

### Current Challenges

- Citizens struggle to identify the correct authority for different issues
- Photo evidence collection is cumbersome and often overlooked
- Location information is frequently missing or inaccurate
- No centralized system to track complaint resolution
- Complex reporting processes discourage civic participation
- Lack of transparency in government response

### Our Solution

A mobile app that captures photo evidence, auto-detects location, routes complaints to appropriate authorities, and provides real-time status tracking—all in under 30 seconds.

---

## Key Features

### 1. 🔐 Secure Authentication

- Email/password login system
- Session management
- Secure logout functionality
- Clean, branded welcome screen

### 2. 📸 Camera Integration

- Real-time camera preview with front/back switching
- High-quality photo capture for evidence
- Modern permission handling with hooks
- Cross-platform compatibility (iOS & Android)
- Pre-capture photo selection option

### 3. 📍 Automatic Location Detection

- GPS coordinate capture with accuracy tracking
- Reverse geocoding for human-readable addresses
- Visual location display on camera screen
- Embedded location data in complaint submissions
- Permission management with user-friendly prompts

### 4. 📝 Smart Complaint System

- Category-based issue classification:

  - Infrastructure (roads, sidewalks, street lights)
  - Cleanliness (litter, waste management)
  - Safety (hazards, broken equipment)
  - Vandalism (graffiti, property damage)
  - Utilities (water, electricity issues)
  - Public Transport (bus stops, accessibility)
  - Noise (disturbances, construction)
  - Others (general concerns)

- Intelligent authority routing:
  - Public Works Department
  - Health Department
  - Police Department
  - Parks & Recreation
  - Transportation Authority
  - Environmental Services

### 5. 🏠 Home Dashboard

- Recent complaints overview
- Real-time status tracking (Pending, In Progress, Resolved)
- Color-coded status indicators with optimized readability
- Quick stats display
- Easy navigation to all features

### 6. 🗺️ Intuitive Navigation

- Bottom tab navigation (Home, Camera, Authorities, Settings)
- Smooth screen transitions
- Material Design UI components
- Consistent user experience

### 7. ⚙️ Settings & Profile

- User profile management
- App information
- Logout functionality
- Future expansion ready

---

## Technical Architecture

### Frontend Stack

**Framework:** React Native 0.74.5  
**UI Library:** React Native Paper 5.12.5  
**Navigation:** React Navigation 6.x

- `@react-navigation/native`: ^6.1.18
- `@react-navigation/bottom-tabs`: ^6.6.1

### State Management

- **Context API** for global state
- React Hooks (useState, useEffect, useRef, useContext)
- ComplaintsContext for complaint management
- Centralized state updates across screens

### Core Dependencies

```json
{
  "expo": "~51.0.28",
  "expo-camera": "~15.0.16",
  "expo-location": "~17.0.1",
  "expo-media-library": "~16.0.5",
  "expo-status-bar": "~1.12.1",
  "react": "18.2.0",
  "react-native": "0.74.5",
  "react-native-paper": "^5.12.5",
  "react-native-safe-area-context": "4.10.5",
  "react-native-screens": "3.31.1",
  "react-native-vector-icons": "^10.2.0",
  "@react-navigation/native": "^6.1.18",
  "@react-navigation/bottom-tabs": "^6.6.1"
}
```

### Project Structure

```
complain-king-app/
├── src/
│   ├── screens/
│   │   ├── LoginScreen.js          (Authentication)
│   │   ├── HomeScreen.js           (Dashboard + Recent Complaints)
│   │   ├── CameraScreen.js         (Camera + Location Capture)
│   │   ├── ComplaintScreen.js      (Form + Submission)
│   │   ├── AuthoritiesScreen.js    (Authority Information)
│   │   └── SettingsScreen.js       (Profile + Settings)
│   └── context/
│       └── ComplaintsContext.js    (Global State Management)
├── App.js                          (Navigation Setup)
├── app.json                        (Expo Configuration)
└── package.json                    (Dependencies)
```

---

## User Flow

### Complete Workflow (< 30 seconds)

```
┌─────────────────────────────────────────────────┐
│  1. LOGIN                                       │
│     Enter email/password → Tap Login           │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│  2. HOME DASHBOARD                              │
│     View recent complaints + quick stats       │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│  3. TAP CAMERA TAB                              │
│     Navigate to camera screen                  │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│  4. CAPTURE PHOTO                               │
│     Location auto-detected                     │
│     Take photo of issue                        │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│  5. FILL COMPLAINT FORM                         │
│     Add description                            │
│     Select category (Infrastructure, etc.)     │
│     Choose authority (Public Works, etc.)      │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│  6. SUBMIT                                      │
│     Complaint added with "Pending" status      │
└─────────────────┬───────────────────────────────┘
                  ↓
┌─────────────────────────────────────────────────┐
│  7. VIEW ON HOME                                │
│     See complaint in Recent Complaints         │
│     Track status updates                       │
└─────────────────────────────────────────────────┘
```

### Alternative Flows

**Managing Profile:**
Settings → View Profile → Logout

**Viewing Authority Info:**
Authorities Tab → Browse department information

---

## Technical Highlights

### 1. Modern Camera Implementation

```javascript
// Using Expo Camera SDK 51 with CameraView
import { CameraView, useCameraPermissions } from "expo-camera";

// Permission handling with hooks
const [permission, requestPermission] = useCameraPermissions();

// High-quality photo capture
const photo = await cameraRef.current.takePictureAsync({
  quality: 0.8,
  base64: false,
});
```

### 2. Location Services Integration

```javascript
// Automatic GPS capture with accuracy
import * as Location from "expo-location";

const location = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.High,
});

// Reverse geocoding for readable addresses
const address = await Location.reverseGeocodeAsync({
  latitude: location.coords.latitude,
  longitude: location.coords.longitude,
});
```

### 3. Context-Based State Management

```javascript
// Centralized complaint management
import { ComplaintsProvider, useComplaints } from "./context/ComplaintsContext";

// Add complaint from any screen
const { addComplaint } = useComplaints();
addComplaint(newComplaint);

// Access complaints anywhere
const { complaints } = useComplaints();
```

### 4. Material Design UI

```javascript
// Consistent, professional design
import { Button, Card, Chip, TextInput } from "react-native-paper";

// Themed components
<Button mode="contained" onPress={handleSubmit}>
  Submit Complaint
</Button>;
```

### 5. Bottom Tab Navigation

```javascript
// Intuitive screen switching
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

<Tab.Navigator>
  <Tab.Screen name="Home" component={HomeScreen} />
  <Tab.Screen name="Camera" component={CameraScreen} />
  <Tab.Screen name="Authorities" component={AuthoritiesScreen} />
  <Tab.Screen name="Settings" component={SettingsScreen} />
</Tab.Navigator>;
```

---

## Challenges & Solutions

### Challenge 1: Camera API Migration

**Problem:** Expo SDK 51 uses updated Camera API with new component structure  
**Solution:** Successfully migrated to `CameraView` component with hooks-based permissions (`useCameraPermissions()`)

### Challenge 2: State Management Across Screens

**Problem:** Complaints needed to be accessible from multiple screens  
**Solution:** Implemented Context API with `ComplaintsContext` for centralized state management

### Challenge 3: Status Text Visibility

**Problem:** "Pending" status text had low contrast and was hard to read  
**Solution:**

- Increased font size (11 → 12)
- Improved font weight (bold → 700)
- Enhanced contrast (darker status colors)
- Added letter spacing (0.5) for better readability

### Challenge 4: Form Validation & Selection

**Problem:** Chip selection state caused `accessibilityState` errors  
**Solution:** Used proper boolean conversion (`!!` and `Boolean()`) for selected states

### Challenge 5: Navigation Structure

**Problem:** Initial stack navigation was complex and unintuitive  
**Solution:** Switched to bottom tab navigation for better UX and mobile-first design

### Challenge 6: Permission Handling

**Problem:** Different permission models on iOS vs Android  
**Solution:** Unified permission flow using Expo hooks with proper error handling and user prompts

---

## Security & Privacy

### Permissions Required

- **Camera:** Photo capture for issue documentation
- **Location:** GPS coordinates for complaint context
- **Media Library:** Temporary photo storage

### Data Handling (Current MVP)

- All data stored locally using Context API (in-memory)
- No cloud storage or external servers in MVP
- No user authentication data stored permanently
- User controls all data

### Privacy Considerations

- Location only captured during photo taking
- No background tracking
- No analytics or third-party tracking
- All data cleared on app restart (MVP phase)
- User can see exactly what data is being submitted

### Future Security Enhancements (Phase 2)

- JWT-based authentication
- Encrypted data storage
- HTTPS API communication
- GDPR compliance
- Data retention policies
- User data export capability

---

## Testing

### Platforms Tested

| Platform                  | Status                | Notes                           |
| ------------------------- | --------------------- | ------------------------------- |
| iOS (Physical Device)     | ✅ Fully Functional   | Primary development platform    |
| Android (Physical Device) | ✅ Fully Functional   | Tested on real hardware         |
| iOS Simulator             | ⚠️ Partial            | Camera unavailable in simulator |
| Android Emulator          | ⚠️ Performance Issues | Works but may have lag          |

### Test Scenarios Completed

- ✅ User authentication flow (login/logout)
- ✅ Camera permission request and handling
- ✅ Photo capture from camera
- ✅ Location detection and accuracy
- ✅ Complaint form validation
- ✅ Category selection
- ✅ Authority selection
- ✅ Complaint submission
- ✅ Status display on Home screen
- ✅ Navigation between all screens
- ✅ Error handling and edge cases
- ✅ UI responsiveness on different screen sizes

### Known Issues

- Android emulator may have performance degradation
- iOS Simulator doesn't support camera hardware
- Location detection requires GPS signal (works best outdoors)
- Data persistence not yet implemented (clears on restart)

---

## Performance Metrics

### App Statistics

- **Initial Load Time:** < 2 seconds
- **Camera Ready Time:** < 1 second
- **Location Detection:** 2-5 seconds (GPS-dependent)
- **Screen Navigation:** Instant (< 100ms)
- **Photo Capture:** Instant
- **Form Submission:** < 500ms

### Code Metrics

- **Total Lines of Code:** ~1,500+ lines
- **Number of Screens:** 6 (Login, Home, Camera, Complaint, Authorities, Settings)
- **Components:** 6 screens + 1 context provider
- **Third-party Dependencies:** 14 main packages
- **Development Time:** ~2 weeks (including iterations)

### App Size (Estimated)

- **Android APK:** ~50MB (with Expo Go)
- **iOS IPA:** ~45MB
- **Production Build:** 15-25MB (after optimization)

---

## Project Deliverables

### 1. Source Code ✅

- Complete React Native application
- Well-structured component architecture
- Comprehensive inline documentation
- Clean, maintainable code

### 2. Presentation Materials ✅

- **Interactive HTML Slides** (10 slides)
  - Problem statement
  - Solution overview
  - Feature demonstrations
  - Technical architecture
  - Live demo walkthrough
  - Future roadmap
- **Detailed Demo Script**
  - Slide-by-slide talking points
  - Timing guidelines (8-10 minutes)
  - Q&A preparation
  - Backup plans for technical issues

### 3. Documentation ✅

- **PROJECT.md** - Comprehensive project overview (this document)
- **Installation Guide** - Step-by-step setup instructions
- **Package List** - All dependencies with explanations
- **Project Scope** - Detailed feature roadmap and timeline

### 4. Working Application ✅

- Functional iOS build
- Functional Android build
- All core features operational

---

## Future Enhancements

### Phase 2: Backend & Core Features (Q4 2025 - Q1 2026)

#### High Priority 🔴

1. **Backend API Integration** (3-4 weeks)

   - RESTful API with Node.js/Express or Firebase
   - PostgreSQL/MongoDB database
   - Cloud storage for images (AWS S3/Firebase)
   - JWT authentication
   - Real-time data synchronization

2. **Push Notifications** (1 week)

   - Status update alerts
   - Authority response notifications
   - Expo Notifications / Firebase Cloud Messaging

3. **User Registration** (1-2 weeks)

   - Signup flow with email verification
   - Password reset functionality
   - Profile customization
   - Account management

4. **Enhanced Status Tracking** (1 week)

   - Timeline view of complaint progress
   - Status change history
   - Estimated resolution time
   - Authority comments visible to users

5. **Complaint Details Screen** (1 week)

   - Full complaint view with all details
   - Edit functionality (if pending)
   - Delete option
   - Status history
   - Share complaint

6. **Search & Filter** (1 week)
   - Search by keyword
   - Filter by status, category, date
   - Sort options (newest, oldest, status)

### Phase 3: Advanced Features (Q2-Q4 2026)

#### Medium Priority 🟡

1. **Community Features**

   - Upvoting system for important issues
   - Comment section on complaints
   - Share to social media
   - Nearby issues map view
   - Trending issues section

2. **Multiple Photos Support**

   - Capture up to 5 photos per complaint
   - Photo gallery picker
   - Image compression and optimization
   - Before/after photo comparison

3. **Video Recording**

   - Short video clips (15-30 seconds)
   - Video evidence for complex issues

4. **Voice Notes**

   - Audio recordings for additional context
   - Voice-to-text transcription option

5. **Complaint Templates**
   - Pre-written templates by category
   - Quick complaint submission
   - Custom template creation

#### Low Priority 🟢

1. **Authority Portal** (Separate App/Web)

   - Dashboard for authorities
   - Complaint management interface
   - Status update tools
   - Response system
   - Performance analytics

2. **Advanced Analytics**

   - User dashboard with personal stats
   - Authority performance metrics
   - Heat maps of issue locations
   - Trend analysis
   - Seasonal patterns

3. **Gamification**

   - User reputation system
   - Badges for active reporters
   - Leaderboards
   - Community contributor recognition

4. **Multi-language Support**

   - English, Mandarin, Malay, Tamil
   - Localized content
   - Translation integration

5. **Offline Mode**

   - Draft complaints saved locally
   - Auto-submit when online
   - Offline viewing of past complaints

6. **Accessibility Improvements**
   - Screen reader optimization
   - Voice commands
   - High contrast mode
   - Adjustable font sizes
   - Color-blind friendly design

---

## Technical Roadmap

### Current State: MVP (v1.0.0) ✅

- Core functionality complete
- Works on iOS and Android
- All primary features operational
- UI polished and user-friendly

### Phase 2: Production Ready (v2.0.0)

**Timeline:** Q4 2025 - Q1 2026  
**Focus:** Backend integration, data persistence, push notifications

### Phase 3: Feature Complete (v3.0.0)

**Timeline:** Q2 2026 - Q4 2026  
**Focus:** Community features, advanced analytics, authority portal

### Phase 4: Scale & Optimize (v4.0.0)

**Timeline:** 2027+  
**Focus:** Performance optimization, enterprise features, regional expansion

---

## Business Potential

### Target Market

- **Primary:** Citizens aged 25-55 in urban areas
- **Secondary:** Community organizations, neighborhood associations
- **Tertiary:** Municipal governments and authorities

### Value Proposition

- **For Citizens:** Faster issue resolution, transparent tracking, easy reporting
- **For Authorities:** Organized complaint management, better resource allocation, improved citizen satisfaction
- **For Communities:** Cleaner, safer neighborhoods, increased civic engagement

### Monetization Strategy (Optional)

#### Free Tier

- Unlimited complaint submissions
- Basic status tracking
- Community features access

#### Premium ($4.99/month)

- Priority complaint processing
- Advanced analytics
- Historical data export
- Ad-free experience
- Custom complaint templates

#### Enterprise ($99/month per authority)

- Authority dashboard access
- Complaint management tools
- Analytics and reporting
- API access
- Custom branding
- Dedicated support

### Market Size

- **Singapore:** 5.9M population, ~4M smartphone users
- **Potential Users:** 500K - 1M active users
- **TAM (Total Addressable Market):** $2-5M annually

---

## Installation & Deployment

### Development Setup

```bash
# Clone repository
git clone [repository-url]
cd complain-king-app

# Install dependencies (recommended method)
npm install @react-navigation/native @react-navigation/bottom-tabs react-native-paper

# Install Expo dependencies
npx expo install react-native-screens react-native-safe-area-context react-native-vector-icons expo-camera expo-location expo-media-library expo-status-bar

# Start development server
npx expo start
```

### Testing Commands

```bash
# Verify installation
npx expo-doctor

# Clear cache and restart
npx expo start --clear

# Platform-specific testing
npm run android    # Android emulator/device
npm run ios        # iOS simulator/device
npm run web        # Web browser
```

### Production Build (Future)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for platforms
eas build --platform ios
eas build --platform android
eas build --platform all

# Submit to app stores
eas submit --platform ios
eas submit --platform android
```

---

## Team & Contributions

### Current Team

- **Lead Developer:** Full-stack development, UI/UX design, testing
- **Technologies Used:** React Native, Expo, JavaScript, Git

### Skills Demonstrated

- Mobile app development (iOS & Android)
- React Native & Expo ecosystem
- State management (Context API)
- API integration (Camera, Location, Media Library)
- UI/UX design with Material Design
- Navigation patterns
- Permission handling
- Error handling and validation
- Git version control
- Technical documentation
- Project presentation skills

### Contribution Guidelines (Future)

- Fork the repository
- Create feature branches
- Follow code style guidelines
- Write unit tests for new features
- Submit pull requests with clear descriptions

---

## Success Metrics

### MVP Success (Phase 1) ✅

- [x] App installs and runs on both iOS and Android
- [x] Users can successfully submit complaints with photos
- [x] Location is captured automatically and accurately
- [x] Status tracking displays correctly
- [x] Navigation is intuitive and smooth
- [x] No critical bugs in core functionality
- [x] Professional UI with Material Design

### Phase 2 Success Criteria

- [ ] 100+ beta users actively testing
- [ ] Complaints persist across app sessions
- [ ] Push notifications delivered reliably
- [ ] <1 second complaint submission time
- [ ] 99% backend uptime
- [ ] Positive user feedback (4+ star rating)

### Phase 3 Success Criteria

- [ ] 1,000+ active monthly users
- [ ] 5+ authority partners onboarded
- [ ] 70%+ complaint resolution rate
- [ ] Featured in local news/media
- [ ] 4.5+ star rating in app stores
- [ ] Community engagement metrics (comments, upvotes)

---

## Lessons Learned

### What Went Well ✅

- **Technology Choice:** React Native + Expo provided rapid cross-platform development
- **State Management:** Context API was perfect for MVP-level state needs
- **UI Library:** React Native Paper gave professional appearance with minimal effort
- **Permission Handling:** Expo's permission hooks simplified complex native APIs
- **Navigation:** Bottom tabs provided intuitive, mobile-first UX
- **Iterative Development:** Regular testing and refinement improved quality significantly

### Challenges Overcome ⚠️

- **API Updates:** Successfully navigated Expo SDK version changes
- **State Synchronization:** Learned to properly manage state across multiple screens
- **UI Polish:** Iterated on designs to improve readability and contrast
- **Form Validation:** Implemented proper boolean handling for selection states
- **Error Handling:** Added comprehensive error catching and user feedback

### Key Takeaways 💡

1. **Start Simple:** MVP approach allowed for working product quickly
2. **Test on Real Devices:** Simulators/emulators have limitations
3. **User Experience Matters:** Small UI improvements make big impact
4. **Documentation is Essential:** Good docs save time and enable collaboration
5. **Plan for Scale:** Architecture decisions should consider future growth

---

## Demo & Resources

### Live Demo

- **iOS:** Fully functional on physical devices
- **Android:** Fully functional on physical devices
- **Expo Go:** Available for quick testing

### Presentation Materials

- **Slides:** Interactive HTML presentation (10 slides)
- **Demo Script:** Complete walkthrough with timing
- **Video Demo:** [Available upon request]

### Documentation

- **Installation Guide:** Step-by-step setup instructions
- **Project Scope:** Detailed roadmap and timeline
- **API Documentation:** [Coming in Phase 2]

### Repository

- **GitHub:** [Repository URL]
- **Issues:** Bug reports and feature requests welcome
- **Wiki:** Additional documentation and guides

---

## Contact & Support

### Project Lead

**Name:** [Your Name]  
**Email:** [Your Email]  
**GitHub:** [Your GitHub]  
**LinkedIn:** [Your LinkedIn]

### Getting Help

- **Issues:** Report bugs via GitHub Issues
- **Questions:** Open discussion in GitHub Discussions
- **Contributions:** See CONTRIBUTING.md (coming soon)

---

## Conclusion

### Current Status

Complain King MVP (v1.0.0) is **complete and fully operational** with all core features working on both iOS and Android platforms. The app successfully demonstrates the viability of streamlined community issue reporting.

### Impact Statement

By reducing complaint submission time from 15+ minutes to under 30 seconds, Complain King empowers citizens to actively participate in improving their communities. The app bridges the gap between citizens and authorities, making civic engagement accessible to everyone.

### Next Milestone

Backend integration (Phase 2) beginning Q4 2025 will transform the app from a local-only tool to a fully connected platform with data persistence, user accounts, and push notifications.

### Vision

To become the primary platform for community issue reporting across Singapore and eventually expand to other cities, fostering better communication between citizens and authorities while making neighborhoods safer, cleaner, and more livable.

---

## Acknowledgments

Special thanks to:

- **Expo Team** for excellent documentation and development tools
- **React Native Community** for open-source contributions
- **React Native Paper** for beautiful UI components
- **Beta Testers** for valuable feedback and bug reports

---

## License

[To be determined - Consider MIT, Apache 2.0, or proprietary]

---

## Appendix

### A. Complete Package List

See `package.json` for full dependency tree

### B. Screen Descriptions

Detailed descriptions of each screen available in code comments

### C. API Documentation

[Coming in Phase 2 with backend integration]

### D. Troubleshooting Guide

Common issues and solutions available in GitHub Wiki

---

**Last Updated:** October 2, 2025  
**Version:** 1.0.0 (MVP)  
**Status:** Production Ready (Local-only functionality)

---

## Questions?

**Thank you for reviewing Complain King!**

For questions, feedback, or collaboration opportunities, please reach out via the contact information above.

**Together, we can make our communities better, one complaint at a time.** 👑
