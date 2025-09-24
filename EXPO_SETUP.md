# Expo Go Development Setup

## 📱 Using Expo Go with FastAPI Backend

### Current Configuration
- **Computer IP**: 192.168.1.4
- **Backend URL**: http://192.168.1.4:8000
- **Expo Dev Server**: Usually runs on port 8081

### ✅ Steps to Use with Expo Go:

1. **Start Backend Server**:
   ```bash
   cd backend
   python main.py
   ```
   - Backend runs on: http://192.168.1.4:8000
   - API docs available at: http://192.168.1.4:8000/docs

2. **Start React Native App**:
   ```bash
   cd frontend/SIHApp
   npm start
   ```
   - Expo dev server starts
   - QR code appears in terminal

3. **Connect with Expo Go**:
   - Install Expo Go app on your phone
   - Scan QR code with Expo Go (Android) or Camera (iOS)
   - Make sure phone and computer are on same WiFi network

### 🔧 Network Requirements:

- **Same WiFi Network**: Phone and computer must be on same network
- **Firewall**: Windows Firewall may block connections - allow if prompted
- **Router**: Some routers block device-to-device communication

### 🐛 Troubleshooting:

#### If Backend Connection Fails:
1. Check if backend is running: http://192.168.1.4:8000
2. Try accessing from phone browser: http://192.168.1.4:8000
3. Check Windows Firewall settings
4. Verify IP address hasn't changed: `ipconfig`

#### If IP Address Changes:
Your IP might change when reconnecting to WiFi. Update in:
- `frontend/SIHApp/src/services/api.ts` (line with COMPUTER_IP)

#### Performance Considerations:

**Wireless Speed**: 
- ✅ Modern WiFi (5GHz) has minimal lag
- ✅ API calls are small and fast
- ✅ Expo Go handles network efficiently

**Typical Response Times**:
- Local network: 1-50ms
- API calls: Very fast on local network
- No noticeable lag for development

### 🚀 Production Considerations:

For production apps:
- Deploy backend to cloud (AWS, Heroku, etc.)
- Use HTTPS
- Remove CORS wildcard
- Use proper domain names

### 📝 Quick Commands:

```bash
# Find your IP address
ipconfig

# Test backend from phone browser
http://192.168.1.4:8000

# Test API health
http://192.168.1.4:8000/health
```