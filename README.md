# Nexus Inventory & Order Management System

A sleek, modern frontend for inventory and order management, built with React, Vite, Tailwind CSS, and shadcn/ui.

## Features
- **Dashboard**: High-level overview and low stock alerts.
- **Products**: Full CRUD operations for managing inventory.
- **Customers**: Customer management.
- **Orders**: View and create complex orders with a multi-step builder.

## Tech Stack
- React 18, Vite, React Router v6
- shadcn/ui, Tailwind CSS v3
- TanStack Query v5, Axios
- React Hook Form + Zod validation
- Docker + Nginx

## Getting Started

### Local Development
```bash
npm install
npm run dev
```

### Docker
```bash
docker-compose up --build
```
This will start the frontend on `http://localhost:3000`.

## Design Philosophy
This application utilizes a modern glassmorphism aesthetic with a dark-first theme, vibrant indigo accents, and subtle micro-animations to create a premium user experience.

> **Note**: As the backend is not yet fully implemented, the application currently uses an in-memory mock interceptor via local storage to simulate API responses.
