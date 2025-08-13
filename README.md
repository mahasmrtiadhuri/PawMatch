# PawMatch - AI-Powered Dog Adoption Platform

PawMatch is an innovative web application that uses AI to match potential adopters with their ideal canine companions. The platform streamlines the adoption process through personalized recommendations, interactive features, and comprehensive shelter management tools.

## 🚀 Features

### For Pet Adopters
- **AI-Powered Matching**: Take a comprehensive quiz to get personalized dog recommendations
- **Smart Search & Filtering**: Find dogs by breed, size, age, activity level, and compatibility
- **Detailed Dog Profiles**: View comprehensive information about each dog including health status, training level, and personality
- **Favorites System**: Save and track your favorite dogs
- **Shelter Information**: Browse participating shelters and their available dogs

### For Shelters
- **Dashboard Management**: Comprehensive shelter dashboard for managing dog listings
- **Dog Profile Management**: Add, edit, and update dog information and photos
- **Adoption Status Tracking**: Monitor and update adoption statuses in real-time
- **Analytics**: View adoption metrics and success rates

### Core Functionality
- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile
- **Real-time Updates**: Live updates on dog availability and adoption status
- **User Authentication**: Secure login system with role-based access (adopters vs shelters)
- **Modern UI**: Clean, intuitive interface built with modern design principles

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with functional components and hooks
- **TypeScript** - Type-safe development with full IntelliSense support
- **Vite** - Fast build tool and development server
- **Wouter** - Lightweight client-side routing
- **TanStack Query** - Data fetching, caching, and synchronization
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality accessible UI components
- **Radix UI** - Unstyled, accessible UI primitives
- **Lucide React** - Beautiful & consistent icons
- **Framer Motion** - Production-ready motion library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe server-side development
- **Drizzle ORM** - Type-safe database operations
- **Zod Validation** - Request/response validation

### Database & Storage
- **PostgreSQL** - Robust relational database (production)
- **In-Memory Storage** - Fast development storage solution
- **Drizzle Kit** - Database migrations and management

### Development Tools
- **ESBuild** - Fast JavaScript bundler
- **PostCSS** - CSS post-processing
- **Autoprefixer** - Automatic CSS vendor prefixing

### AI & Machine Learning
- **TensorFlow.js** - Machine learning capabilities for recommendation engine
- **Custom Matching Algorithm** - Intelligent dog-adopter compatibility scoring

## 📦 Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── dogs/       # Dog-related components
│   │   │   ├── home/       # Homepage components
│   │   │   ├── layout/     # Layout components (Navbar, Footer)
│   │   │   ├── quiz/       # Matching quiz components
│   │   │   ├── shelters/   # Shelter-related components
│   │   │   └── ui/         # shadcn/ui components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configurations
│   │   ├── pages/          # Page components
│   │   └── App.tsx         # Main application component
│   └── index.html          # HTML entry point
├── server/                 # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API route definitions
│   ├── storage.ts         # Data storage interface
│   └── vite.ts            # Vite integration
├── shared/                 # Shared types and schemas
│   └── schema.ts          # Database schema and types
└── attached_assets/       # Project assets and documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pawmatch
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000` to view the application

### Environment Setup

The application runs on a single port (5000) with Vite handling both frontend and backend serving. No additional configuration is required for development.

For production deployment with a database:
- Set up PostgreSQL database
- Configure environment variables for database connection
- Run database migrations using Drizzle Kit

## 🎯 Key Features Implementation

### AI Matching Algorithm
The recommendation engine uses a multi-factor scoring system that considers:
- Lifestyle compatibility (activity level, home type, yard access)
- Experience level matching
- Family composition (kids, other pets)
- Size and space requirements
- Time availability for care

### Data Architecture
- **Type-safe schema** defined in `shared/schema.ts`
- **Consistent validation** using Zod schemas across frontend and backend
- **Optimistic updates** with TanStack Query for responsive UI
- **Efficient caching** strategy for improved performance

### User Experience
- **Progressive disclosure** in the matching quiz (3-step process)
- **Responsive design** that works seamlessly across devices
- **Accessible components** built with Radix UI primitives
- **Loading states** and error handling throughout the application

## 🔧 Development Workflow

### Code Organization
- **Component-based architecture** with clear separation of concerns
- **Custom hooks** for reusable stateful logic
- **Shared types** between frontend and backend
- **Consistent styling** with Tailwind CSS utility classes

### API Design
- **RESTful endpoints** for all CRUD operations
- **Type-safe request/response** validation
- **Error handling** with meaningful error messages
- **Consistent data formats** across all endpoints

## 📱 Responsive Design

PawMatch is built mobile-first with responsive breakpoints:
- **Mobile**: < 768px - Single column layout, touch-optimized interactions
- **Tablet**: 768px - 1024px - Two-column grids, optimized for touch
- **Desktop**: > 1024px - Multi-column layouts, hover interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Acknowledgments

- Dog photos sourced from Unsplash
- UI components built with shadcn/ui and Radix UI
- Icons provided by Lucide React
- AI recommendations powered by TensorFlow.js

---

**PawMatch** - Connecting hearts, one paw at a time. 🐾
