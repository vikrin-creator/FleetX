# FleetX

A modern fleet management application built with React.js and Tailwind CSS.

## 🚀 Tech Stack

### Frontend
- **React.js** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Build tool and dev server

### Backend (To be implemented)
- **PHP** - Server-side language
- **MySQL/MariaDB** - Database
- **RESTful API** - API architecture

## 📁 Project Structure

```
FleetX/
├── frontend/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── common/        # Reusable components (buttons, inputs, etc.)
│   │   │   └── layout/        # Layout components (Header, Footer, Layout)
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service functions
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   ├── context/           # React context providers
│   │   ├── assets/            # Images, icons, etc.
│   │   │   ├── images/
│   │   │   └── icons/
│   │   ├── styles/            # Global styles
│   │   ├── App.js             # Root component
│   │   └── main.js            # Application entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── backend/                    # (To be implemented)
    ├── api/
    │   └── v1/                # API endpoints
    ├── config/                # Configuration files
    ├── models/                # Database models
    ├── middleware/            # Middleware functions
    ├── utils/                 # Utility functions
    └── database/
        ├── migrations/        # Database migrations
        └── seeds/             # Seed data
```

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and configure your settings.

4. **Start development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

5. **Build for production:**
   ```bash
   npm run build
   ```

## 📝 Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🎨 Styling

This project uses Tailwind CSS for styling. Custom utility classes and components are defined in:
- `src/styles/index.css` - Global styles and custom Tailwind classes

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_APP_NAME=FleetX
VITE_APP_VERSION=1.0.0
```

## 📦 Key Dependencies

- `react` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `tailwindcss` - CSS framework
- `vite` - Build tool

## 🚧 Coming Soon

- Backend API implementation
- Database setup and migrations
- Authentication system
- Complete CRUD operations
- Advanced fleet management features

## 📄 License

This project is private and proprietary.

## 👥 Author

Vikrin Projects
