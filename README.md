# 🛒 বাজার দর (Bazar Dor)

**আজকের বাজারদর, এক নজরে।**

Bazar Dor is a Bengali-first market price tracking web application designed to help users explore the prices of everyday essentials in Bangladesh. It provides a user-friendly interface to browse products, compare market prices, and understand daily price changes.

This project was developed as part of **Programming Hero — Batch 14, Assignment 07 (B14-A7)**.

## 🌐 Live Demo & Repository

- **Live Website:** https://b14-a7-bazardor.vercel.app/
- **GitHub Repository:** https://github.com/sabbir-codes/b14-a7-bazardor

## ✨ Key Features

- 📱 **Fully Responsive Design:** Optimized for mobile, tablet, and desktop devices.
- 📈 **Daily Price Updates:** Displays products with price changes, including rising and falling prices.
- 🛍️ **Product Listing:** Browse a collection of everyday grocery and essential products.
- 🗂️ **Category-Based Browsing:** Explore products by category and find relevant items easily.
- 💰 **Market Price Comparison:** View product pricing information to help users compare prices across markets.
- 🔐 **Secure Authentication:** Supports email/password authentication with Google and GitHub social login using Better Auth.
- 👤 **User Profile:** Access user account information through the authentication system.
- 🔔 **Toast Notifications:** Provides feedback for relevant authentication actions and errors.
- ⏳ **Loading States:** Improves the user experience while data is loading.
- 🚫 **Error Handling:** Provides appropriate feedback for unavailable content and invalid routes.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Next.js | React framework and application routing |
| React.js | Building reusable UI components |
| TypeScript | Type-safe development |
| Tailwind CSS | Styling and responsive layouts |
| Better Auth | Authentication and social login |
| PostgreSQL (Neon) | Database integration |
| REST API | Fetching product and category data |
| React Hot Toast / Toast Notifications | User feedback and notifications |
| Vercel | Deployment and hosting |
| Git & GitHub | Version control and source code management |

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

- Node.js installed
- npm installed
- Git installed

### 1. Clone the Repository

```bash
git clone https://github.com/sabbir-codes/b14-a7-bazardor.git
```

### 2. Navigate to the Project Directory

```bash
cd b14-a7-bazardor
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root and configure the required environment variables.

```env
DATABASE_URL=your_postgresql_connection_string
BETTER_AUTH_SECRET=your_secure_secret
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Configure any additional API-related environment variables required by your project.

**Important:** Replace the placeholder values with your actual credentials. Never commit real secrets, database credentials, or OAuth client secrets to GitHub.

### 5. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 6. Build for Production

```bash
npm run build
```

## 📂 Project Overview

The application is organized around reusable components and Next.js App Router pages to support product browsing, category navigation, authentication, and user account functionality.

- **App Router:** Handles application pages and navigation.
- **Components:** Contains reusable interface elements.
- **Authentication:** Manages sign-in, sign-up, and social login.
- **Data Integration:** Connects the application with product APIs and the configured database.
- **Deployment:** Hosted on Vercel.

## 📋 Assignment Information

- **Course:** Programming Hero
- **Batch:** 14
- **Milestone:** 7
- **Assignment:** 07 — Bazar Dor
- **Developer:** M M Sabbir Ahammed Pavel

## 🔗 Important Links

- **Live Project:** https://b14-a7-bazardor.vercel.app/
- **Source Code:** https://github.com/sabbir-codes/b14-a7-bazardor

---

Made by **Sabbir** ❤️