# Nexus Inventory & Order Management System

A sleek, modern frontend for inventory and order management, built with React, Vite, Tailwind CSS, and shadcn/ui.

## ✨ Features
- **Dashboard**: High-level overview, quick stats, and low stock alerts.
- **Products**: Full CRUD operations for managing inventory levels, pricing, and SKUs.
- **Customers**: Manage customer records efficiently.
- **Orders**: View and create complex orders with a multi-step builder and line items.
- **Responsive Design**: Glassmorphism aesthetic with a dark-first theme and vibrant indigo accents.

## 🛠️ Tech Stack
- **Framework**: React 18, Vite
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v3, shadcn/ui components
- **State Management & Data Fetching**: TanStack Query v5, Axios
- **Forms & Validation**: React Hook Form, Zod
- **Deployment**: Docker, Nginx

## 🚀 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- Docker & Docker Compose (optional, for containerized deployment)

### Environment Variables
Create a `.env` file in the root of the project to point to your backend API. If you don't create one, it defaults to `http://localhost:8080`.
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```
*(Make sure this matches your backend API URL. We recommend using `127.0.0.1` instead of `localhost` to avoid IPv6 resolution issues with certain backends like FastAPI).*

### Local Development
To run the app in development mode:
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```
The application will be available at `http://localhost:5173`.

### Docker Deployment
To run the application using Docker:
```bash
docker-compose up --build -d
```
This builds the production assets using a multi-stage Dockerfile and serves them via NGINX. The application will be exposed on `http://localhost:5173` (matching the Vite dev port to avoid CORS issues).

## 📂 Project Structure
- `/src/components` - Reusable UI and layout components (shadcn/ui in `/src/components/ui`)
- `/src/pages` - Main application views (Dashboard, Products, Orders, etc.)
- `/src/services` - API integration using Axios
- `/src/hooks` - React Query hooks for data fetching
- `/src/lib` - Utility functions

## 🎨 Design Philosophy
This application utilizes a modern aesthetic with subtle micro-animations to create a premium user experience. It's built mobile-first and is fully responsive.
