# Design Document

## Overview

The pushup assessment feature integrates computer vision-based exercise detection into the existing SIH fitness app. The design focuses on creating a seamless user experience from sport selection to pushup assessment completion, using React Native with Expo and TensorFlow Lite for real-time pushup detection.

The system will extend the current navigation flow by adding a new PushupAssessmentScreen that launches when users press "Start Assessment" from the SportDetailScreen. The implementation will be minimal and focused exclusively on pushup detection, avoiding the complexity of multi-exercise detection.

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────────┐
│  SportDetail    │───▶│ PushupAssessment │───▶│ AssessmentResults   │
│  Screen         │    │ Screen           │    │ Screen              │
└─────────────────┘    └──────────────────┘    └─────────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │ Computer Vision  │
                       │ Detection Engine │
                       └──────────────────┘
```

### Technology Stack

- **Frontend Framework**: React Native with Expo
- **Computer Vision**: TensorFlow Lite for React Native
- **Camera Access**: Expo Camera API
- **State Management**: React Hooks (useState, useEffect, useRef)
- **Navigation**: React Navigation Stack Navigator
- **Pose Detection**: MediaPipe Pose or TensorFlow Lite Pose Detection
- **Performance**: React Native Reanimated for smooth animations

### Integration Strategy

The design will integrate the pushup detection logic from the SIH-Exercises repository (https://github.com/codinggem404-gif/SIH-Exercises) by:
1. Cloning the repository and extracting only pushup-related detection algorithms
2. Adapting the Python-based detection logic for React Native/Expo environment using TensorFlow.js or TensorFlow Lite
3. Converting the pushup detection model and pose estimation logic to work with React Native Camera
4. Implementing real-time feedback using React Native components while maintaining the core detection accuracy from the original repository

## Components and Interfaces

### 1. PushupAssessmentScreen Component

**Purpose**: Main assessment interface with camera feed and real-time detection

**Props Interface**:
```typescript
interface PushupAssessmentScreenProps {
  route: {
    params: {
      sportId: string;
      sportName: string;
      experienceLevel: number;
      highestLevel: string;
    }
  };
}
```

**Key Features**:
- Full-screen camera view with overlay UI
- Real-time pushup counter display
- Start/Pause/Stop controls
- Visual feedback indicators
- Form guidance overlays

### 2. PushupDetectionEngine Service

**Purpose**: Core computer vision logic for pushup detection

**Interface**:
```typescript
interface PushupDetectionEngine {
  initialize(): Promise<boolean>;
  startDetection(onPushupDetected: (count: number) => void): void;
  pauseDetection(): void;
  stopDetection(): void;
  getCurrentCount(): number;
  isDetectionActive(): boolean;
}
```

**Key Responsibilities**:
- Load TensorFlow Lite model for pose detection
- Process camera frames in real-time
- Analyze body keypoints for pushup movement patterns
- Trigger callbacks when valid pushups are detected
- Manage detection state and performance optimization

### 3. CameraOverlay Component

**Purpose**: UI overlay on top of camera feed

**Props Interface**:
```typescript
interface CameraOverlayProps {
  pushupCount: number;
  isDetecting: boolean;
  detectionFeedback: 'good' | 'adjust_position' | 'not_detected';
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
}
```

**Visual Elements**:
- Pushup counter with large, readable font
- Detection status indicator (green/yellow/red)
- Control buttons (Start/Pause/Stop)
- Positioning guide overlay
- Form feedback messages

### 4. AssessmentResultsScreen Component

**Purpose**: Display assessment results and provide next actions

**Props Interface**:
```typescript
interface AssessmentResultsProps {
  route: {
    params: {
      totalPushups: number;
      duration: number;
      assessmentData: AssessmentSession;
    }
  };
}
```

**Features**:
- Total pushup count display
- Assessment duration
- Performance summary
- Save/Retake options
- Navigation back to sports selection

### 5. AssessmentDataService

**Purpose**: Handle assessment data persistence and retrieval

**Interface**:
```typescript
interface AssessmentDataService {
  saveAssessment(session: AssessmentSession): Promise<void>;
  getAssessmentHistory(userId: string): Promise<AssessmentSession[]>;
  getLatestAssessment(userId: string): Promise<AssessmentSession | null>;
}

interface AssessmentSession {
  id: string;
  userId: string;
  sportId: string;
  totalPushups: number;
  duration: number;
  timestamp: Date;
  experienceLevel: number;
  highestLevel: string;
}
```

## Data Models

### PushupDetectionState

```typescript
interface PushupDetectionState {
  isInitialized: boolean;
  isDetecting: boolean;
  currentCount: number;
  sessionStartTime: Date | null;
  lastDetectionTime: Date | null;
  detectionConfidence: number;
  bodyKeypoints: Keypoint[];
}

interface Keypoint {
  x: number;
  y: number;
  confidence: number;
  name: string;
}
```

### AssessmentConfiguration

```typescript
interface AssessmentConfiguration {
  detectionThreshold: number; // Minimum confidence for valid detection
  minimumPushupDuration: number; // Minimum time between pushups (ms)
  maxSessionDuration: number; // Maximum assessment time (ms)
  requiredKeypoints: string[]; // Essential body parts for detection
  formValidationEnabled: boolean;
}
```

## Error Handling

### Camera Permission Errors
- **Error**: Camera access denied
- **Handling**: Display permission request dialog with explanation
- **Fallback**: Provide manual counter option or return to sport selection

### Model Loading Errors
- **Error**: TensorFlow Lite model fails to load
- **Handling**: Show loading error message with retry option
- **Fallback**: Offer simplified assessment without computer vision

### Detection Performance Issues
- **Error**: Low FPS or high latency
- **Handling**: Automatically reduce detection frequency
- **Fallback**: Display performance warning and continue with reduced accuracy

### Device Compatibility Issues
- **Error**: Unsupported device or OS version
- **Handling**: Check device capabilities on screen load
- **Fallback**: Graceful degradation to manual counting mode

### Network and Storage Errors
- **Error**: Failed to save assessment results
- **Handling**: Cache results locally and retry when connection available
- **Fallback**: Allow user to continue with warning about unsaved data

## Testing Strategy

### Unit Testing
- **PushupDetectionEngine**: Test detection algorithm accuracy with mock pose data
- **AssessmentDataService**: Test data persistence and retrieval operations
- **Component Logic**: Test state management and user interaction handlers

### Integration Testing
- **Camera Integration**: Test camera initialization and frame processing
- **Navigation Flow**: Test screen transitions and parameter passing
- **Data Flow**: Test end-to-end assessment data handling

### Performance Testing
- **Frame Rate**: Ensure consistent 15+ FPS during detection
- **Memory Usage**: Monitor memory consumption during extended sessions
- **Battery Impact**: Test power consumption during camera and ML operations

### User Acceptance Testing
- **Detection Accuracy**: Test with various user body types and positions
- **Lighting Conditions**: Test in different lighting environments
- **Device Orientation**: Test portrait and landscape orientations
- **User Experience**: Test complete assessment flow with real users

### Device Testing Matrix
- **iOS**: iPhone 12+, iPad (latest 2 generations)
- **Android**: Samsung Galaxy S21+, Google Pixel 6+
- **Performance Tiers**: High-end (flagship), Mid-range (2-3 years old)

## Implementation Phases

### Phase 1: Core Infrastructure
- Set up camera permissions and Expo Camera integration
- Create basic PushupAssessmentScreen with camera view
- Implement navigation from SportDetailScreen
- Add basic UI overlay components

### Phase 2: Computer Vision Integration
- Integrate TensorFlow Lite for React Native
- Adapt pushup detection algorithm from external repository
- Implement real-time pose detection pipeline
- Add basic pushup counting logic

### Phase 3: User Experience Enhancement
- Add visual feedback and form guidance
- Implement assessment controls (start/pause/stop)
- Create AssessmentResultsScreen
- Add error handling and fallback mechanisms

### Phase 4: Data Persistence and Polish
- Implement AssessmentDataService for data storage
- Add assessment history and progress tracking
- Performance optimization and testing
- UI/UX refinements and accessibility improvements

## Security and Privacy Considerations

### Camera Data Handling
- All camera processing occurs locally on device
- No video data is transmitted or stored remotely
- Camera access is requested with clear permission explanations

### Assessment Data Privacy
- Assessment results stored locally with user consent
- Optional cloud sync with encrypted data transmission
- User controls for data deletion and export

### Model Security
- TensorFlow Lite models bundled with app (no remote loading)
- Model integrity verification on app startup
- Secure model updates through app store distribution