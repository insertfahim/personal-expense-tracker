# 💰 Personal Expense Tracker

A full-stack MERN application for tracking personal expenses with a modern, responsive design. Built with Next.js frontend and Node.js/Express backend with MongoDB database.

## ✨ Features

### Core Features

-   **User Authentication**: Secure JWT-based authentication with registration and login
-   **Expense Management**: Full CRUD operations for expenses (Create, Read, Update, Delete)
-   **Categories**: Organize expenses into predefined categories (Food, Transport, Shopping, Entertainment, Healthcare, Bills, Others)
-   **Real-time Validation**: Client and server-side form validation with helpful error messages
-   **Responsive Design**: Mobile-first responsive design that works on all devices

### Advanced Features

-   **Search & Filter**: Search expenses by title and filter by category
-   **Statistics Dashboard**: View total expenses, transaction counts, and averages
-   **Visual Analytics**: Beautiful charts and graphs using Recharts (planned)
-   **Date Range Filtering**: Filter expenses by date range (planned)
-   **Export Data**: Export expense data to CSV (planned)

## 🛠 Tech Stack

### Frontend

-   **Next.js 14+**: React framework with App Router
-   **TypeScript**: Type-safe development
-   **Tailwind CSS**: Utility-first CSS framework
-   **React Hook Form**: Form handling and validation
-   **Yup**: Schema validation
-   **Axios**: HTTP client for API requests
-   **React Hot Toast**: Toast notifications
-   **Lucide React**: Beautiful icons
-   **Recharts**: Charts and data visualization

### Backend

-   **Node.js**: JavaScript runtime
-   **Express.js**: Web framework
-   **MongoDB**: NoSQL database
-   **Mongoose**: MongoDB object modeling
-   **JWT**: JSON Web Tokens for authentication
-   **bcryptjs**: Password hashing
-   **Express Validator**: Request validation middleware
-   **CORS**: Cross-origin resource sharing
-   **dotenv**: Environment variable management

## 📁 Project Structure

```
personal-expense-tracker/
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   └── index.js        # Server entry point
│   ├── package.json
│   └── .env
├── frontend/                # Next.js frontend
│   ├── src/
│   │   ├── app/            # Next.js App Router pages
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utilities and services
│   │   └── types/          # TypeScript type definitions
│   ├── package.json
│   └── .env.local
└── README.md
```

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   MongoDB (local installation or MongoDB Atlas)
-   npm or yarn package manager

### Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd personal-expense-tracker
    ```

2. **Backend Setup**

    ```bash
    cd backend
    npm install

    # Create environment file
    cp .env.example .env

    # Edit .env with your configuration
    # MONGODB_URI=mongodb://localhost:27017/expense_tracker
    # JWT_SECRET=your-super-secret-jwt-key
    # PORT=5000
    ```

3. **Frontend Setup**

    ```bash
    cd ../frontend
    npm install

    # Create environment file
    cp .env.local.example .env.local

    # Edit .env.local with your configuration
    # NEXT_PUBLIC_API_URL=http://localhost:5000/api
    ```

4. **Database Setup**
    - Install MongoDB locally or set up MongoDB Atlas
    - Update the `MONGODB_URI` in your backend `.env` file
    - The database and collections will be created automatically

### Running the Application

1. **Start the Backend Server**

    ```bash
    cd backend
    npm run dev
    ```

    The API server will start on http://localhost:5000

2. **Start the Frontend Application**

    ```bash
    cd frontend
    npm run dev
    ```

    The web application will be available at http://localhost:3000

3. **Access the Application**
    - Open your browser and navigate to http://localhost:3000
    - Register a new account or use demo credentials (if provided)
    - Start tracking your expenses!

## 🔧 Configuration

### Backend Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expense_tracker
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Personal Expense Tracker
```

## 📊 API Endpoints

### Authentication

-   `POST /api/auth/register` - Register new user
-   `POST /api/auth/login` - User login
-   `GET /api/auth/profile` - Get user profile (Protected)

### Expenses

-   `GET /api/expenses` - Get all expenses with pagination and filters
-   `GET /api/expenses/:id` - Get single expense
-   `POST /api/expenses` - Create new expense (Protected)
-   `PATCH /api/expenses/:id` - Update expense (Protected)
-   `DELETE /api/expenses/:id` - Delete expense (Protected)
-   `GET /api/expenses/stats` - Get expense statistics (Protected)

### Health Check

-   `GET /api/health` - API health status

## 💡 Usage Examples

### Adding an Expense

1. Click "Add Expense" from the dashboard or navigation
2. Fill in the expense details:
    - Title: "Lunch at McDonald's"
    - Amount: 12.50
    - Category: Food
    - Date: Select date
3. Click "Add Expense" to save

### Filtering Expenses

-   Use the search bar to find expenses by title
-   Select a category from the dropdown to filter by category
-   Combine search and category filters for precise results

### Managing Expenses

-   Click the edit icon to modify an expense
-   Click the delete icon to remove an expense (with confirmation)
-   View expense statistics on the dashboard

## 🧪 Testing

### Backend Testing

```bash
cd backend
npm test
```

### Frontend Testing

```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)

1. Set up your production database (MongoDB Atlas recommended)
2. Configure environment variables in your hosting platform
3. Deploy the backend directory

### Frontend Deployment (Vercel/Netlify)

1. Update `NEXT_PUBLIC_API_URL` to point to your production API
2. Deploy the frontend directory
3. Configure build settings if necessary

### Environment-Specific Configurations

-   **Development**: Uses local MongoDB and development settings
-   **Production**: Uses MongoDB Atlas and optimized settings

## 📱 Screenshots

[Add screenshots of your application here]

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Notes

### Git Commit Guidelines

This project follows meaningful commit messages:

-   `feat:` New features
-   `fix:` Bug fixes
-   `docs:` Documentation updates
-   `style:` Code style changes
-   `refactor:` Code refactoring
-   `test:` Adding tests

### Code Style

-   Frontend: ESLint + Prettier configuration for consistent code style
-   Backend: Node.js best practices with proper error handling
-   TypeScript: Strict type checking enabled

## 🔒 Security Features

-   **Password Hashing**: Uses bcryptjs for secure password storage
-   **JWT Authentication**: Secure token-based authentication
-   **Input Validation**: Server and client-side validation
-   **CORS Protection**: Configured cross-origin resource sharing
-   **Environment Variables**: Sensitive data stored in environment files

## 📈 Performance Optimizations

-   **Database Indexing**: Optimized MongoDB queries with proper indexing
-   **API Pagination**: Paginated responses for large datasets
-   **Frontend Caching**: React Query for efficient data caching
-   **Image Optimization**: Next.js built-in image optimization
-   **Bundle Splitting**: Automatic code splitting with Next.js

## 🆘 Troubleshooting

### Common Issues

1. **Connection Errors**

    - Verify MongoDB is running and connection string is correct
    - Check if backend server is running on the correct port

2. **Authentication Issues**

    - Ensure JWT_SECRET is set in backend environment
    - Clear browser localStorage if facing login issues

3. **Build Errors**
    - Delete node_modules and package-lock.json, then reinstall
    - Check for TypeScript errors in the terminal

## 📚 Learning Resources

-   [Next.js Documentation](https://nextjs.org/docs)
-   [Express.js Guide](https://expressjs.com/en/guide/routing.html)
-   [MongoDB Manual](https://docs.mongodb.com/)
-   [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Created as part of a MERN Stack Developer Assessment Task.

## 🙏 Acknowledgments

-   Icons by [Lucide](https://lucide.dev/)
-   UI Components inspired by modern design patterns
-   MongoDB for excellent database documentation
-   Next.js team for the amazing React framework

---

**Note**: This is a demonstration project showcasing full-stack development skills with modern web technologies. The focus is on clean code, proper architecture, and user-friendly design.
