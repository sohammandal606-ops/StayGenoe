<<<<<<< HEAD
# Airbnb Full Stack Project
=======
# StayGenoe
>>>>>>> 4e1a50de52353cc799c4f8f9cbeb57300025eb9f

A full-stack web application built with Node.js, Express, MongoDB, and EJS that replicates core features of Airbnb. Users can list properties, search for accommodations, read and write reviews, and communicate through an AI-powered chat feature.

## 🚀 Features

- **User Authentication**: Secure user registration and login using Passport.js with local strategy
- **Listings Management**: Create, read, update, and delete property listings with images and detailed information
- **Geolocation Support**: Store and retrieve property locations using GIS coordinates
- **Reviews & Ratings**: Users can leave reviews and ratings for listings
- **Image Upload**: Support for uploading and managing property images
- **AI Chat Assistant**: Integrated Google Generative AI for intelligent chat functionality
- **Flash Messages**: User feedback with success and error notifications
- **Data Validation**: Joi schema validation for secure data handling
- **Security Features**: Helmet for HTTP headers, MongoDB sanitization, CSRF protection
- **Responsive Design**: EJS templating with Bootstrap-based styling

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js (Web framework)
- MongoDB & Mongoose (Database & ODM)
- Passport.js (Authentication)

**Frontend:**
- EJS (Template Engine)
- EJS-mate (Layout engine)
- CSS (Custom styling)
- JavaScript (Client-side logic)

**Additional Libraries:**
- `multer` - File upload handling
- `node-geocoder` - Geolocation services
- `dotenv` - Environment variables management
- `helmet` - Security middleware
- `joi` - Schema validation
- `connect-flash` - Flash message handling
- `@mistralai/mistralai` - AI chat functionality

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (Local or Atlas)
- Mistral AI API Key (for chat feature)

## 🔧 Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd "Airbnb full stack project"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory with the following variables:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
   NODE_ENV=development
   MISTRAL_API_KEY=your-mistral-api-key
   ```

4. **Start the application:**
   ```bash
   npm start
   ```

   Or with live reload (using nodemon):
   ```bash
   npx nodemon app.js
   ```

5. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
├── app.js                    # Main application entry point
├── package.json              # Project dependencies
├── .env                      # Environment variables (create this)
│
├── controllers/              # Business logic
│   ├── listings.js           # Listing CRUD operations
│   ├── reviews.js            # Review operations
│   └── users.js              # User management
│
├── models/                   # MongoDB schemas
│   ├── listing.js            # Listing model with GIS support
│   ├── review.js             # Review model
│   └── user.js               # User model with Passport integration
│
├── routes/                   # API routes
│   ├── listings.js           # Listing routes
│   ├── reviews.js            # Review routes
│   ├── users.js              # User authentication routes
│   └── chat.js               # Chat routes
│
├── middleware/               # Custom middleware
│   └── middleware.js         # Authentication & validation middleware
│
├── views/                    # EJS template pages
│   ├── layouts/              # Layout templates
│   ├── listings/             # Listing pages
│   ├── users/                # User pages
│   ├── includes/             # Reusable components
│   └── error.ejs             # Error page
│
├── public/                   # Static assets
│   ├── css/                  # Stylesheets
│   └── js/                   # Client-side scripts
│
├── uploads/                  # User-uploaded files
│
└── utils/                    # Utility functions
    ├── ExpressError.js       # Custom error class
    └── wrapAsync.js          # Async error wrapper
```

## 📖 Usage

### User Registration & Login
- Navigate to the signup page to create a new account
- Use your registered credentials to log in
- Flash messages will confirm successful authentication

### Browse Listings
- View all available listings on the home page
- Click on a listing to view detailed information
- See property location, price, description, and reviews

### Create a Listing
- Log in to your account
- Click "Create Listing" button
- Fill in property details: title, price, location, description, and upload image
- Your listing will be added to the database

### Leave Reviews
- Navigate to any listing detail page
- Scroll to the reviews section
- Add a rating and comment
- Your review will appear immediately

### Chat Feature
- Use the integrated chat assistant for property recommendations or questions
- Powered by Google Generative AI

### Manage Your Listings
- View your profile page to see your listed properties
- Edit or delete your listings as needed
- Update property information anytime

## 🔐 Security Features

- **Password Hashing**: User passwords are securely hashed using Passport-Local-Mongoose
- **Session Management**: Secure session handling with httpOnly cookies
- **Input Validation**: Joi schema validation prevents invalid data
- **MongoDB Sanitization**: Protection against NoSQL injection attacks
- **Helmet**: Security HTTP headers protection
- **CSRF Protection**: Built-in protection against cross-site request forgery

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Verify your `MONGO_URI` in `.env` is correct
- Check your MongoDB Atlas network access settings
- Ensure your IP address is whitelisted

**Image Upload Issues:**
- Check the `/uploads` directory exists and has write permissions
- Verify multer configuration in routes

**Chat Feature Not Working:**
- Ensure `GOOGLE_API_KEY` is set correctly in `.env`
- Verify API key is enabled in Google Cloud Console

## 📝 Environment Variables

Create a `.env` file with these variables:

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `NODE_ENV` | Application environment (development/production) |
| `GOOGLE_API_KEY` | Google Generative AI API key |

## 🚀 Deployment

### Deploy to Heroku:
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Push to Heroku git:
   ```bash
   git push heroku main
   ```

### Deploy to Other Platforms:
- Ensure Node.js version is compatible
- Set all environment variables in the hosting platform
- Use `npm start` as the start command

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments in relevant files
3. Check MongoDB and Passport documentation

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Express.js for the web framework
- MongoDB for the database
- Passport.js for authentication
- Google Generative AI for chat functionality
- All open-source contributors

---

**Happy hosting! 🏠**
