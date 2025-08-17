# 💰 Personal Expense Tracker

<div align="center">

![Personal Expense Tracker](https://img.shields.io/badge/Personal-Expense%20Tracker-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black?style=for-the-badge&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)

**A modern, full-stack MERN application for tracking personal expenses with real-time analytics and beautiful UI**

[🚀 Live Demo](https://expense-tracker-by-fahim.vercel.app/) • [📖 Documentation](#-documentation) • [🐛 Report Bug](https://github.com/insertfahim/personal-expense-tracker/issues) • [💡 Request Feature](https://github.com/insertfahim/personal-expense-tracker/issues)

</div>

---

## 🌟 **Overview**

Personal Expense Tracker is a comprehensive, full-stack web application designed to help users manage their personal finances with ease. Built with modern web technologies, it offers a seamless experience for tracking expenses, analyzing spending patterns, and maintaining financial awareness.

### **✨ Key Highlights**

-   🔒 **Secure Authentication** - JWT-based user authentication with password hashing
-   📊 **Real-time Analytics** - Interactive charts and spending insights
-   🎨 **Modern UI/UX** - Responsive design with Tailwind CSS and smooth animations
-   🚀 **Cloud Ready** - Optimized for Vercel deployment with serverless functions
-   📱 **Mobile First** - Fully responsive design that works on all devices
-   ⚡ **Fast Performance** - Optimized with Next.js 15 and Turbopack

---

## 🎯 **Features**

### **🔐 Authentication & Security**

-   [x] User registration and login with validation
-   [x] JWT-based secure authentication
-   [x] Password hashing with bcryptjs
-   [x] Protected routes and middleware
-   [x] Session management with auto-logout

### **💰 Expense Management**

-   [x] Create, read, update, and delete expenses
-   [x] Categorize expenses (Food, Transport, Shopping, Entertainment, Healthcare, Bills, Others)
-   [x] Search expenses by title or description
-   [x] Filter by category and date range
-   [x] Bulk operations support

### **📈 Analytics & Insights**

-   [x] Real-time expense statistics
-   [x] Monthly and yearly spending summaries
-   [x] Category-wise expense breakdown
-   [x] Interactive charts with Recharts
-   [x] Spending trends visualization

### **🎨 User Experience**

-   [x] Intuitive and clean interface
-   [x] Real-time form validation
-   [x] Toast notifications for user feedback
-   [x] Loading states and error handling
-   [x] Dark/Light mode support (coming soon)

### **🚀 Performance & Deployment**

-   [x] Optimized for Vercel serverless deployment
-   [x] API route optimization
-   [x] Database connection pooling
-   [x] Image optimization
-   [x] Code splitting and lazy loading

---

## 🛠 **Technology Stack**

<div align="center">

### **Frontend**

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-000000?style=flat&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-06B6D4?style=flat&logo=tailwindcss&logoColor=white)

### **Backend**

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-4.18.2-000000?style=flat&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=flat&logo=jsonwebtokens&logoColor=white)

### **Tools & Libraries**

![Axios](https://img.shields.io/badge/Axios-1.11.0-671DDF?style=flat&logo=axios&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-7.62.0-EC5990?style=flat&logo=reacthookform&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-3.1.2-FF6C37?style=flat)

</div>

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

---

## 🚀 **Quick Start**

### **Prerequisites**

-   Node.js 18+ installed
-   MongoDB Atlas account (or local MongoDB)
-   Git installed
-   Code editor (VS Code recommended)

### **🔧 Installation**

1. **Clone the repository**

    ```bash
    git clone https://github.com/insertfahim/personal-expense-tracker.git
    cd personal-expense-tracker
    ```

2. **Backend Setup**

    ```bash
    cd backend
    npm install
    cp .env.example .env
    ```

    **Edit `.env` file:**

    ```env
    NODE_ENV=development
    PORT=5000
    MONGODB_URI=mongodb+srv://admin:admin@mariyaquiz.gd34udu.mongodb.net/personal_expense_tracker?retryWrites=true&w=majority&appName=mariyaquiz
    JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
    FRONTEND_URL=http://localhost:3000
    ```

3. **Frontend Setup**

    ```bash
    cd ../frontend
    npm install
    ```

    **Create `.env.local` file:**

    ```env
    NEXT_PUBLIC_API_URL=http://localhost:5000/api
    NEXT_PUBLIC_APP_NAME=Personal Expense Tracker
    ```

### **🖥️ Running the Application**

1. **Start Backend Server**

    ```bash
    cd backend
    npm run dev
    ```

    Server will run on `http://localhost:5000`

2. **Start Frontend Application**

    ```bash
    cd frontend
    npm run dev
    ```

    Application will run on `http://localhost:3000`

3. **Access the Application**
    - Open browser and go to `http://localhost:3000`
    - Register a new account or login
    - Start tracking your expenses! 🎉

---

## 🔧 **Environment Configuration**

### **Development Environment**

```env
# Backend (.env)
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://admin:admin@mariyaquiz.gd34udu.mongodb.net/personal_expense_tracker?retryWrites=true&w=majority&appName=mariyaquiz
JWT_SECRET=development-secret-key
FRONTEND_URL=http://localhost:3000

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=Personal Expense Tracker
```

### **Production Environment**

```env
# Vercel Environment Variables
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal_expense_tracker
JWT_SECRET=super-secure-production-secret
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🧪 **Testing**

### **Backend Tests**

```bash
cd backend
npm test                # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage
```

### **Frontend Tests**

```bash
cd frontend
npm test               # Run component tests
npm run test:e2e      # Run end-to-end tests
```

### **API Testing with Thunder Client/Postman**

Import the API collection from `/docs/api-collection.json`

---

## 🤝 **Contributing**

We welcome contributions! Please follow these steps:

### **Getting Started**

1. **Fork the repository**
2. **Create a feature branch**
    ```bash
    git checkout -b feature/amazing-feature
    ```
3. **Make your changes**
4. **Commit your changes**
    ```bash
    git commit -m 'feat: add amazing feature'
    ```
5. **Push to the branch**
    ```bash
    git push origin feature/amazing-feature
    ```
6. **Open a Pull Request**

### **Commit Convention**

We use [Conventional Commits](https://www.conventionalcommits.org/):

-   `feat:` New features
-   `fix:` Bug fixes
-   `docs:` Documentation updates
-   `style:` Code style changes
-   `refactor:` Code refactoring
-   `test:` Adding tests
-   `chore:` Build process or auxiliary tool changes

---

## 📊 **API Documentation**

### **Authentication Endpoints**

| Method | Endpoint             | Description       | Auth Required |
| ------ | -------------------- | ----------------- | ------------- |
| `POST` | `/api/auth/register` | Register new user | ❌            |
| `POST` | `/api/auth/login`    | User login        | ❌            |
| `GET`  | `/api/auth/profile`  | Get user profile  | ✅            |

### **Expense Endpoints**

| Method   | Endpoint              | Description                  | Auth Required |
| -------- | --------------------- | ---------------------------- | ------------- |
| `GET`    | `/api/expenses`       | Get all expenses (paginated) | ✅            |
| `GET`    | `/api/expenses/:id`   | Get single expense           | ✅            |
| `POST`   | `/api/expenses`       | Create new expense           | ✅            |
| `PATCH`  | `/api/expenses/:id`   | Update expense               | ✅            |
| `DELETE` | `/api/expenses/:id`   | Delete expense               | ✅            |
| `GET`    | `/api/expenses/stats` | Get expense statistics       | ✅            |

### **Utility Endpoints**

| Method | Endpoint      | Description      | Auth Required |
| ------ | ------------- | ---------------- | ------------- |
| `GET`  | `/api/health` | API health check | ❌            |

### **Example API Usage**

**Create Expense:**

```javascript
POST /api/expenses
Content-Type: application/json
Authorization: Bearer <your-jwt-token>

{
  "title": "Lunch at McDonald's",
  "amount": 12.50,
  "category": "Food",
  "date": "2025-08-16",
  "description": "Quick lunch break"
}
```

**Response:**

```javascript
{
  "success": true,
  "data": {
    "_id": "66c123...",
    "title": "Lunch at McDonald's",
    "amount": 12.50,
    "category": "Food",
    "date": "2025-08-16T00:00:00.000Z",
    "description": "Quick lunch break",
    "user": "66c456...",
    "createdAt": "2025-08-16T10:30:00.000Z"
  }
}
```

---

## � **Security Features**

-   🔐 **Password Security**: bcryptjs hashing with salt rounds
-   🛡️ **JWT Authentication**: Secure token-based auth with expiration
-   🚫 **Input Validation**: Server & client-side validation
-   🌐 **CORS Protection**: Configured cross-origin policies
-   🔒 **Environment Security**: Sensitive data in environment variables
-   ⚡ **Rate Limiting**: API rate limiting to prevent abuse
-   🛡️ **Helmet.js**: Security headers protection

---

## 📈 **Performance Optimizations**

-   ⚡ **Database Indexing**: Optimized MongoDB queries
-   📄 **Pagination**: Efficient data loading
-   🗄️ **Caching**: React Query for client-side caching
-   🎯 **Code Splitting**: Automatic with Next.js
-   🖼️ **Image Optimization**: Next.js built-in optimization
-   📦 **Bundle Analysis**: Optimized bundle sizes
-   🚀 **Edge Functions**: Vercel serverless optimization

---

## 🆘 **Troubleshooting**

### **Common Issues**

#### **Database Connection Issues**

```bash
# Check MongoDB connection
MongoDB Connected: ✅ or Connection failed: ❌

# Solutions:
1. Verify MONGODB_URI in .env file
2. Check MongoDB Atlas network access
3. Ensure correct database name: personal_expense_tracker
4. Verify Atlas credentials
```

#### **Authentication Problems**

```bash
# JWT Token Issues
- Clear localStorage: localStorage.clear()
- Check JWT_SECRET in backend .env
- Verify token expiration
```

#### **Build Errors**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# TypeScript errors
npm run type-check
```

---

## 🗺️ **Roadmap**

### **Phase 1: Core Features** ✅

-   [x] User authentication
-   [x] CRUD operations for expenses
-   [x] Basic analytics
-   [x] Responsive design
-   [x] Vercel deployment setup

### **Phase 2: Enhanced Features** 🚧

-   [ ] Advanced analytics dashboard
-   [ ] Data export functionality
-   [ ] Budget planning and tracking
-   [ ] Receipt image upload
-   [ ] Multi-currency support

### **Phase 3: Advanced Features** 📋

-   [ ] Dark/Light mode toggle
-   [ ] Progressive Web App (PWA)
-   [ ] Offline functionality
-   [ ] Push notifications
-   [ ] Social sharing

---

## 🚀 **Deployment**

### **Vercel Deployment (Recommended)**

1. **Prepare for Deployment**

    ```bash
    # Ensure all changes are committed
    git add .
    git commit -m "feat: prepare for deployment"
    git push origin main
    ```

2. **Deploy to Vercel**

    - Connect your GitHub repository to Vercel
    - Import your project: `personal-expense-tracker`
    - Configure build settings:
        - Build Command: `cd frontend && npm run build`
        - Output Directory: `frontend/.next`
        - Install Command: `npm install`

3. **Environment Variables in Vercel**

    ```env
    MONGODB_URI=your-mongodb-atlas-connection-string
    JWT_SECRET=your-super-secure-secret
    NODE_ENV=production
    FRONTEND_URL=https://expense-tracker-by-fahim.vercel.app
    ```

4. **Deploy!**
    - Click "Deploy" and your app will be live! 🎉
    - Your app will be available at `https://expense-tracker-by-fahim.vercel.app`

### **Alternative Deployment Options**

#### **Railway (Backend)**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### **Netlify (Frontend)**

-   Build Command: `cd frontend && npm run build`
-   Publish Directory: `frontend/out`

---

## � **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 **Author & Acknowledgments**

<div align="center">

**Created with ❤️ by [insertfahim](https://github.com/insertfahim)**

### **Special Thanks**

-   🎯 **Next.js Team** - Amazing React framework
-   🚀 **Vercel Team** - Seamless deployment platform
-   🍃 **MongoDB** - Excellent database solution
-   🎨 **Tailwind CSS** - Beautiful utility-first CSS
-   🔧 **Open Source Community** - Incredible tools and libraries

### **Connect & Support**

[![GitHub followers](https://img.shields.io/github/followers/insertfahim?style=social)](https://github.com/insertfahim)
[![GitHub stars](https://img.shields.io/github/stars/insertfahim/personal-expense-tracker?style=social)](https://github.com/insertfahim/personal-expense-tracker)

**Found this project helpful? Give it a ⭐ on GitHub!**

</div>

---

<div align="center">

### **🚀 Ready to start tracking your expenses?**

[**Live Demo**](https://expense-tracker-by-fahim.vercel.app/) • [**Deploy Your Own**](https://vercel.com/import/project?template=https://github.com/insertfahim/personal-expense-tracker)

---

**Built with modern web technologies • Deployed on Vercel • Database powered by MongoDB Atlas**

_This project demonstrates full-stack development skills with modern web technologies, clean architecture, and best practices for production-ready applications._

</div>
