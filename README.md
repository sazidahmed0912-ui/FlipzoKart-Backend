# 🛍️ Flipzokart - Full-Scale E-commerce Website

## 📂 Project Structure
```
Flipzokart/
├── server/ (Backend - Node.js)
│   ├── models/ (Database Schema)
│   ├── routes/ (APIs)
│   ├── server.js (Main Entry)
│   ├── package.json
│   └── .env
└── client/ (Frontend - React)
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🚀 Setup Instructions

### Backend Setup (Node.js)

1. Navigate to server folder:
```bash
cd server
npm install
```

2. Make sure MongoDB is running on your machine (or update MONGO_URI in .env)

3. Start the backend server:
```bash
npm run dev
```
Server will run on `http://localhost:5000`

### Frontend Setup (React)

1. Navigate to client folder:
```bash
cd client
npm install
```

2. Start the React development server:
```bash
npm start
```
App will run on `http://localhost:3000`

## 🔗 API Endpoints

- `GET /api/products` - Get all products
- `POST /api/products` - Add a new product
- `DELETE /api/products/:id` - Delete a product
- `PUT /api/products/:id` - Update a product

## 🎯 Features

✅ **Full CRUD Operations** - Add, delete and update products from the admin panel
✅ **Real-time Data Sync** - Frontend fetches data automatically with React hooks
✅ **Flipzokart Theme** - Blue header and orange buttons
✅ **MongoDB Integration** - Optional persistent data storage
✅ **Responsive Design** - Mobile-friendly layout using Tailwind CSS
✅ **Admin Panel** - Admin section for product management
✅ **Shop View** - Product listing and showcase

## 📝 How to Use

1. **Shop View**: Browse all products
2. **Admin Panel**: Open the admin panel from your account
3. **Add Product**: Fill product details and press "UPLOAD PRODUCT"
4. **Delete Product**: Remove products from the admin panel using the "Delete" button

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, Axios, Tailwind CSS
- **Database**: MongoDB

## 📌 Important Notes

 - MongoDB should be running locally if you use it
 - Alternatively update `MONGO_URI` in `.env`
 - Frontend and backend run as separate servers

Happy Coding! 🎉
