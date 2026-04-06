# Elderly Care Support Platform

A complete end-to-end web application monorepo for elderly care.

## Structure Overview

This repository is organized as a monorepo containing:
- `backend/`: Node.js + Express backend providing the REST API and connecting to MongoDB.
- `frontend/`: Vite + React frontend for the user interface.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB

### Setup Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` to `.env` and fill in your variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Setup Frontend
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
