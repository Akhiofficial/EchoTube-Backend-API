
## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- Cloudinary account for image uploads

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Pro_project_chai_code_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   CORS_ORIGIN=http://localhost:3000
   
   # JWT Secrets
   ACCESS_TOKEN_SECRET=your_access_token_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ACCESS_TOKEN_EXPIRES_IN=1d
   REFRESH_TOKEN_EXPIRES_IN=10d
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:8000`

## �� API Endpoints

### User Authentication

| Method | Endpoint | Description | Body Parameters |
|--------|----------|-------------|-----------------|
| POST | `/api/v1/users/register` | Register new user | `fullName`, `email`, `password`, `username`, `contactNumber` (optional), `avatar` (file), `coverImage` (file) |
| POST | `/api/v1/users/login` | User login | `email`/`username`, `password` |
| POST | `/api/v1/users/logout` | User logout | Requires authentication |
| POST | `/api/v1/users/refresh-token` | Refresh access token | `refreshToken` |

### Example API Usage

#### Register User
```bash
curl -X POST http://localhost:8000/api/v1/users/register \
  -H "Content-Type: multipart/form-data" \
  -F "fullName=John Doe" \
  -F "email=john@example.com" \
  -F "password=password123" \
  -F "username=johndoe" \
  -F "avatar=@/path/to/avatar.jpg"
```

#### Login User
```bash
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## 🔧 Key Features Explained

### 1. User Model Schema
- **Fields**: name, email, fullName, contactNumber, password, avatar, coverImage, refreshToken, watchHistory
- **Pre-save hook**: Automatically hashes passwords before saving
- **Methods**: Password verification, JWT token generation

### 2. Authentication Flow
- **Registration**: Validates input, checks for existing users, uploads images, creates user
- **Login**: Verifies credentials, generates access/refresh tokens, sets HTTP-only cookies
- **Logout**: Clears refresh token from database and cookies
- **Token Refresh**: Validates refresh token and issues new access token

### 3. File Upload System
- **Multer**: Handles multipart/form-data for file uploads
- **Cloudinary**: Stores images in the cloud with optimized URLs
- **Validation**: Ensures required avatar image is provided

### 4. Error Handling
- **Custom ApiError class**: Standardized error responses
- **AsyncHandler**: Wraps async functions to catch errors
- **AppResponse**: Consistent success response format

## 🛡️ Security Considerations

- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Security**: Separate access and refresh tokens with different expiration times
- **Cookie Security**: HTTP-only cookies for token storage
- **Input Validation**: Field validation and sanitization
- **CORS**: Configurable cross-origin resource sharing

## 🧪 Development

### Available Scripts
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests (not implemented yet)

### Code Style
- Prettier configuration for consistent code formatting
- ES6+ syntax with import/export statements
- Modular architecture with separation of concerns

## 📝 Learning Notes

This project was built following Chai and Code YouTube tutorials to understand:
- Modern Node.js/Express.js development
- MongoDB integration with Mongoose
- JWT authentication implementation
- File upload handling
- Error handling and middleware patterns
- API design and RESTful principles

## �� Contributing

This is a learning project, but feel free to:
- Report bugs or issues
- Suggest improvements
- Fork and experiment with the code

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

## �� Acknowledgments

- **Chai and Code** - YouTube channel for the excellent tutorial series
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Cloudinary** - Cloud image management service

---

**Note**: This project is created for learning and understanding backend development concepts. It's not intended for production use without additional security measures and testing.