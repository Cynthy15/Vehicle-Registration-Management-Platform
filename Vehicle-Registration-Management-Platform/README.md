# Vehicle Registration & Management Platform

## Project Overview
This represents a robust, production-grade frontend dashboard for Vehicle Registration and Management. It interfaces with an Express.js backend API and enforces strict data validation schemas.

### Key Features
- **Client-side Authentication:** Uses Context API to manage session state (`test@gmail.com` / `Password!234`).
- **Protected Routing:** Redirects unauthenticated users seamlessly.
- **Complex Multi-step Forms:** Powered by `react-hook-form` and `zod` for strict error-checking before data transmission.
- **Caching & State Management:** Utilizes TanStack React Query to fetch lists and segment requests optimizing performance.
- **Premium UI:** Glassmorphism, smooth animations, and responsive layout using TailwindCSS + Lucide Icons.

## Local Setup Instructions
1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file pointing to your backend:
   ```env
   VITE_API_URL=https://your-api.com/api
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## Architecture & State Management
- **Routing:** Handled via `react-router-dom` using nested layouts (`Layout`, `ProtectedRoute`).
- **State/Caching:** `TanStack Query` prevents redundant API calls and offers optimistic updates or loading states automatically. Segmented details (`/vehicle/:id/info`, `/vehicle/:id/owner`, etc.) are intelligently fetched based on active tabs.
- **Form State:** `react-hook-form` tracks inputs while the wizard retains data in parent local state (`FormData`) until final step submission. Validation rules exactly mirror backend constraints to prevent generic 422 Unprocessable Entity errors.
