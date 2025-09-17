# Pro Project - Backend API

Hey there! 👋 I'm a student learning backend development, and this is my project built while following the amazing tutorials from the **Chai and Code** YouTube channel. This project represents my journey into understanding Node.js, Express.js, MongoDB, and modern backend development practices.

## 🎯 What I Learned

Through building this project, I explored:
- **User Authentication**: How to create secure login/registration systems
- **File Uploads**: Handling images with Multer and Cloudinary
- **Database Management**: Working with MongoDB and Mongoose
- **JWT Tokens**: Understanding authentication and authorization
- **API Development**: Building RESTful APIs with proper error handling
- **Security**: Password hashing, input validation, and CORS

## 🛠️ Technologies I Used

As a student, I got hands-on experience with:
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - Object Data Modeling for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Multer** - File upload middleware
- **Cloudinary** - Cloud image storage
- **Nodemon** - Development server with auto-restart

## 📁 My Project Structure

Here's how I organized my code (following best practices I learned):

```
Pro_project_chai_code_backend/
├── src/
│   ├── controllers/          # Business logic for user operations
│   ├── db/                   # Database connection setup
│   ├── middlewears/          # Custom middleware functions
│   ├── models/               # Database schemas and models
│   ├── routes/               # API route definitions
│   ├── utils/                # Helper functions and utilities
│   ├── app.js                # Express app configuration
│   └── index.js              # Server startup file
├── public/                   # Static files and uploads
└── package.json              # Project dependencies
```

## 🚀 How to Run My Project

### Step 1: Setup
```bash
# Clone my project
git clone <repository-url>
cd Pro_project_chai_code_backend

# Install the packages I used
npm install
```

### Step 2: Environment Variables
Create a `.env` file (I learned this is important for security!):
```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000

# JWT Secrets (I learned these should be kept secret!)
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=10d

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 3: Start the Server
```bash
npm run dev
```

The server will start on `http://localhost:8000` 

##  What My API Can Do

### User Registration
```bash
POST /api/v1/users/register
```
- Register with name, email, password, username
- Upload avatar and cover images
- Validates all inputs
- Checks for existing users

### User Login
```bash
POST /api/v1/users/login
```
- Login with email/username and password
- Returns JWT tokens
- Sets secure cookies

### User Logout
```bash
POST /api/v1/users/logout
```
- Clears authentication tokens
- Requires valid JWT token

### Refresh Token
```bash
POST /api/v1/users/refresh-token
```
- Get new access token using refresh token
- Extends user session

## 🔍 Key Features I Implemented

### 1. User Authentication System
- **Registration**: Full user signup with image uploads
- **Login**: Secure authentication with JWT
- **Password Security**: Bcrypt hashing (I learned this is crucial!)
- **Token Management**: Access and refresh tokens

### 2. File Upload System
- **Multer Middleware**: Handles file uploads
- **Cloudinary Integration**: Stores images in the cloud
- **Image Validation**: Ensures proper file types

### 3. Database Design
- **User Model**: Complete user schema with timestamps
- **Relationships**: Watch history for future video features
- **Validation**: Mongoose schema validation

### 4. Error Handling
- **Custom Error Classes**: Proper error responses
- **Async Handler**: Catches async function errors
- **Input Validation**: Prevents bad data

## 🎓 My Learning Journey

### What I Found Challenging
- Understanding JWT token flow
- Setting up proper error handling
- Managing file uploads with Multer
- Database relationships and queries

### What I Enjoyed Learning
- Building a complete authentication system
- Working with cloud services (Cloudinary)
- Understanding middleware concepts
- API design and RESTful principles

### Key Concepts I Grasped
- **Middleware**: Functions that run between request and response
- **JWT**: Stateless authentication tokens
- **MVC Pattern**: Model-View-Controller architecture
- **Async/Await**: Modern JavaScript for handling promises
- **Environment Variables**: Keeping secrets secure

## 🎯 Future Learning Goals

As I continue my learning journey, I want to explore:
- **Testing**: Unit and integration tests
- **Deployment**: Deploying to cloud platforms
- **Advanced Features**: Real-time communication, caching
- **Performance**: Database optimization, API rate limiting

## 🙏 Acknowledgments

**Huge thanks to Chai and Code YouTube channel!** 🎥
- Their step-by-step tutorials made complex concepts easy to understand
- The practical approach helped me build real-world applications
- Their teaching style is perfect for beginners like me

##  Resources That Helped Me

- **Chai and Code YouTube Channel** - Main learning resource
- **Express.js Documentation** - Understanding middleware and routing
- **MongoDB Documentation** - Database operations and Mongoose
- **JWT.io** - Understanding JSON Web Tokens

## 💡 Tips for Fellow Students

1. **Start Small**: Don't try to understand everything at once
2. **Practice Regularly**: Build small projects to reinforce concepts
3. **Read Documentation**: Official docs are your best friend
4. **Join Communities**: Discord, Reddit, Stack Overflow
5. **Build Projects**: Apply what you learn in real projects

## 🎓 Student Notes

This project is part of my backend development learning journey. I'm sharing it to:
- Document my learning progress
- Help other students understand the concepts
- Get feedback from the community
- Build a portfolio of my work

---

**Student Developer** 👨‍🎓  
*Learning Backend Development with Chai and Code*

*P.S. If you're also learning backend development, feel free to reach out! We can learn together! 🚀*