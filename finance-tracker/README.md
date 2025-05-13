# 💰 Finance Tracker

A simple and intuitive mobile + web finance tracker app built with **React Native**, **Firebase**, and **Expo**. Users can track income and expenses, view charts and summaries, filter transactions, and manage their data in real-time across platforms.

## ✨ Features

- 🔐 **User Authentication**
  - Email & password sign-up/login
  - Persistent login using Firebase Auth

- 📒 **Transaction Management**
  - Add, edit, and delete income and expense transactions
  - Date, amount, category, and optional note for each entry

- 📊 **Visual Summaries**
  - Pie chart of income/expense by category
  - Monthly or all-time toggle
  - Summary card showing total income, expenses, and balance

- 🔎 **Search & Filter**
  - Search transactions by description or category
  - Filter by month or view all transactions

- 🔄 **Cross-Platform Support**
  - Optimized for Android, iOS, and Web
  - Responsive design with mobile-friendly UI

## 🧑‍💻 Tech Stack

- **React Native** (via Expo)
- **Firebase**
  - Firestore (real-time database)
  - Authentication
- **React Navigation**
- **React Native Chart Kit**
- **AsyncStorage** (for persistent auth)

## 📁 Folder Structure

```
/src
  /components
    Chart.jsx
    SummaryCard.jsx
    TransactionItem.jsx
    Layout.jsx
    Navbar.jsx
  /contexts
    AuthContext.jsx
    TransactionContext.jsx
  /screens
    LoginScreen.jsx
    SignupScreen.jsx
    HomeScreen.jsx
    AddTransactionScreen.jsx
    EditTransactionScreen.jsx
    TransactionListScreen.jsx
    SearchScreen.jsx
  /data
    categories.js
  /utils
    firebase.js
App.js
```

## 🔧 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/KyleLavigne/INF657-Final
cd finance-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Firebase Configuration

Create a `.env` file at the root with your Firebase credentials:

```env
FIREBASE_API_KEY=your_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Make sure you have `@env` support set up in your `babel.config.js`:

```js
plugins: [['module:react-native-dotenv']]
```

### 4. Run the app

#### For mobile:

```bash
npx expo start
```

#### For web:

```bash
npx expo start --web
```

## 📦 Build & Deployment

You can build for mobile with:

```bash
npx expo run:android
npx expo run:ios
```

And deploy web with Firebase Hosting or Vercel if needed.

## 🧠 Acknowledgments

- Firebase for backend services
- Expo team for React Native tooling
- [react-native-chart-kit](https://github.com/indiespirit/react-native-chart-kit) for charts

## 📝 License

MIT License © 2025 Kyle Lavigne