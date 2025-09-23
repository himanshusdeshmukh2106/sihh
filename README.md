# SIH Project - React Native + FastAPI Full Stack App

A modern full-stack application built with the latest technologies and best practices for 2024.

## 🚀 Technology Stack

### Frontend (React Native + TypeScript)
- **React Native 0.81** with Expo SDK 54
- **TypeScript 5.9** for type safety
- **React Navigation 6** for navigation
- **Axios** for API communication
- **AsyncStorage** for local data persistence
- **Modern UI** with custom components

### Backend (FastAPI + Python)
- **FastAPI 0.115.6** - Latest stable version
- **Python 3.12** support
- **Pydantic v2** for data validation
- **SQLAlchemy 2.0** for database ORM
- **JWT Authentication** with python-jose
- **Automatic API documentation** (Swagger/ReDoc)
- **CORS** enabled for React Native

## 📁 Project Structure

```
sih/
├── frontend/SIHApp/          # React Native TypeScript app
│   ├── src/
│   │   ├── navigation/       # React Navigation setup
│   │   ├── screens/          # App screens
│   │   ├── services/         # API service layer
│   │   ├── types/           # TypeScript definitions
│   │   └── components/      # Reusable components
│   ├── package.json
│   └── App.tsx
├── backend/                 # FastAPI Python backend
│   ├── app/
│   │   ├── api/            # API routes
│   │   │   └── endpoints/  # Individual endpoint files
│   │   ├── core/           # Core configuration
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic
│   ├── main.py            # FastAPI app entry point
│   └── requirements.txt   # Python dependencies
└── README.md              # This file
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+ and pip
- Expo CLI (`npm install -g @expo/cli`)
- Android Studio / Xcode (for device testing)

### Backend Setup (FastAPI)

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Copy environment file:
   ```bash
   cp .env.example .env
   ```

4. Start the FastAPI server:
   ```bash
   python main.py
   ```
   
   The API will be available at:
   - **Main API**: http://localhost:8000
   - **API Documentation**: http://localhost:8000/docs
   - **Alternative Docs**: http://localhost:8000/redoc

### Frontend Setup (React Native)

1. Navigate to frontend directory:
   ```bash
   cd frontend/SIHApp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npm start
   ```

4. Run on your device:
   - **Android**: Press `a` in terminal or scan QR code with Expo Go
   - **iOS**: Press `i` in terminal or scan QR code with Camera app
   - **Web**: Press `w` in terminal

## 📱 Features

### Implemented Features
- ✅ **Modern React Native** with Expo SDK 54
- ✅ **TypeScript** throughout the application
- ✅ **FastAPI Backend** with latest version (0.115.6)
- ✅ **JWT Authentication** system
- ✅ **RESTful API** with CRUD operations
- ✅ **Navigation** with React Navigation 6
- ✅ **API Integration** with Axios
- ✅ **Error Handling** and loading states
- ✅ **Responsive UI** with modern design
- ✅ **Auto-generated API docs** with Swagger

### API Endpoints

#### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout
- `GET /api/v1/auth/me` - Get current user

#### Users
- `GET /api/v1/users` - List users (with pagination)
- `GET /api/v1/users/{id}` - Get user by ID
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

#### Items
- `GET /api/v1/items` - List items (with filters)
- `GET /api/v1/items/{id}` - Get item by ID
- `POST /api/v1/items` - Create item
- `PUT /api/v1/items/{id}` - Update item
- `DELETE /api/v1/items/{id}` - Delete item
- `GET /api/v1/items/categories` - Get categories

## 🧪 Testing

### Demo Credentials
For testing the login functionality:
- **Email**: `user@example.com`
- **Password**: `password`

### API Testing
1. Visit http://localhost:8000/docs for interactive API testing
2. Use the authentication endpoints to get a JWT token
3. Test CRUD operations on users and items

## 🔧 Development

### Backend Development
- The FastAPI server supports **hot reload** during development
- API documentation is automatically generated and updated
- Database models use SQLAlchemy 2.0 (currently with SQLite)
- Environment variables can be configured in `.env` file

### Frontend Development
- Expo provides **hot reload** for React Native
- TypeScript ensures type safety across the application
- API calls are centralized in the `apiService`
- Navigation is type-safe with TypeScript

### Code Quality
- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Modern patterns** and best practices throughout

## 🚀 Deployment

### Backend Deployment
- Use `gunicorn` for production server
- Configure environment variables for production
- Set up proper database (PostgreSQL recommended)
- Enable HTTPS and security headers

### Frontend Deployment
- Build for production: `expo build`
- Deploy to app stores via Expo or standalone builds
- Configure production API endpoints

## 📚 Latest Technologies Used

This project uses the most up-to-date versions and best practices as of 2024:

- **React Native 0.81** (latest stable)
- **FastAPI 0.115.6** (latest stable)
- **Pydantic v2** (latest major version)
- **React Navigation 6** (latest major version)
- **TypeScript 5.9** (latest stable)
- **SQLAlchemy 2.0** (latest major version)
- **Expo SDK 54** (latest stable)

## 🔮 Next Steps

1. **Database Integration**: Replace SQLite with PostgreSQL
2. **Real Authentication**: Implement proper user registration/login
3. **State Management**: Add Redux Toolkit or Zustand
4. **Testing**: Add unit tests and integration tests
5. **Push Notifications**: Implement with Expo Notifications
6. **Offline Support**: Add offline data synchronization
7. **Performance**: Optimize with React.memo and useMemo
8. **Security**: Implement proper security headers and validation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.