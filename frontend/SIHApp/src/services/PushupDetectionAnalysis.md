# SIH-Exercises Repository Analysis

## Key Findings from Repository Analysis

### Repository Structure
- **Main Implementation**: `fitness_tracker_pro.py` - Production-ready fitness tracker
- **Core Algorithm**: `implementaion.py` - Simplified pushup detection logic
- **Pre-trained Model**: `pushup_keypoint_model.h5` - TensorFlow/Keras model for pose detection
- **Model Training**: `model_training.py` and `model_training_fixed.py` - Training scripts

### Pushup Detection Algorithm

#### Core Detection Logic (from `implementaion.py`):
1. **Model Input**: 192x192 RGB image
2. **Output**: 34 keypoints (17 body landmarks × 2 coordinates)
3. **Key Body Parts for Pushup Detection**:
   - Left Shoulder (keypoint 5): indices 10, 11
   - Left Elbow (keypoint 7): indices 14, 15
   - Left Wrist (keypoint 9): indices 18, 19
   - Right Shoulder (keypoint 6): indices 12, 13
   - Right Elbow (keypoint 8): indices 16, 17
   - Right Wrist (keypoint 10): indices 20, 21

#### Angle Calculation:
```python
def calculate_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    ba = a - b
    bc = c - b
    cosine_angle = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-7)
    angle = np.arccos(np.clip(cosine_angle, -1.0, 1.0))
    return np.degrees(angle)
```

#### State Machine Logic:
- **DOWN_ANGLE_THRESHOLD**: 140° (elbow angle when pushup is fully down)
- **UP_ANGLE_THRESHOLD**: 170° (elbow angle when pushup is fully up)
- **States**: "up", "down"
- **Counting Logic**: 
  - Transition from "up" to "down" when avg_elbow_angle <= 140°
  - Count increment when transitioning from "down" to "up" when avg_elbow_angle >= 170°

#### Form Analysis Features:
1. **Symmetry Check**: Compare left vs right elbow angles
2. **Extension Check**: Ensure full elbow extension
3. **Form Scoring**: Based on ideal angles and movement patterns

### Advanced Features (from `fitness_tracker_pro.py`):

#### PushupTracker Class Features:
- **Form Scoring**: 0-100% based on ideal 90° down position
- **Hold Time**: 0.3 seconds to prevent false positives
- **Visibility Threshold**: 0.5 minimum for reliable detection
- **Calorie Calculation**: 0.32 calories per pushup
- **Statistics Tracking**: Best form score, average duration, total calories

#### State Management:
```python
class PushupTracker:
    def __init__(self):
        self.state = "up"
        self.count = 0
        self.last_transition_time = time.time()
        self.down_threshold = 140
        self.up_threshold = 170
        self.hold_time = 0.3
```

### Integration Requirements for React Native:

#### Dependencies Needed:
- TensorFlow.js or TensorFlow Lite for React Native
- MediaPipe alternative or custom pose detection
- Camera access via Expo Camera

#### Key Adaptations Required:
1. **Model Conversion**: Convert `.h5` model to TensorFlow.js format
2. **Keypoint Processing**: Adapt Python logic to JavaScript/TypeScript
3. **Real-time Processing**: Optimize for mobile performance
4. **Camera Integration**: Process camera frames in real-time

#### Performance Considerations:
- **Target FPS**: 15+ for smooth detection
- **Image Size**: 192x192 for model input (resize from camera feed)
- **Memory Management**: Efficient tensor operations
- **Battery Optimization**: Reduce processing when not needed

### Recommended Implementation Approach:

1. **Use MediaPipe Pose** instead of custom model for better React Native support
2. **Adapt the angle calculation and state machine logic** from the repository
3. **Implement the form scoring system** for user feedback
4. **Add the hold time mechanism** to prevent false positives
5. **Include symmetry checking** for better form analysis

### Key Constants to Use:
```typescript
const PUSHUP_CONFIG = {
  DOWN_ANGLE_THRESHOLD: 140,
  UP_ANGLE_THRESHOLD: 170,
  HOLD_TIME: 300, // milliseconds
  MIN_VISIBILITY: 0.5,
  CALORIES_PER_PUSHUP: 0.32,
  SYMMETRY_THRESHOLD: 15 // degrees
};
```