# Store Rating Platform

A full-stack web application that enables users to submit and manage ratings for registered stores with role-based access control.

## 🚀 Tech Stack

- **Frontend**: React.js with Vite + TypeScript
- **Backend**: Next.js API Routes + TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS (recommended)

## 📋 Features

### Role-Based Access Control
- **System Administrator**: Manage users, stores, and view analytics
- **Normal User**: Browse stores, submit and update ratings
- **Store Owner**: View ratings and customer feedback

### Key Functionalities
- User authentication and authorization
- Store management and browsing
- Rating submission (1-5 stars)
- Advanced filtering and sorting
- Dashboard analytics
- Password management

## 🏗️ Project Structure

```
store-rating-platform/
├── frontend/                    # React + Vite Frontend
│   ├── src/
│   │   ├── assets/             # Images, icons, static files
│   │   ├── components/         # Reusable components
│   │   │   ├── common/        # Shared components (Button, Input, etc.)
│   │   │   ├── layout/        # Layout components (Header, Sidebar, etc.)
│   │   │   ├── admin/         # Admin-specific components
│   │   │   ├── user/          # User-specific components
│   │   │   └── store/         # Store-related components
│   │   ├── pages/             # Page components
│   │   │   ├── auth/          # Login, Signup pages
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   ├── user/          # User dashboard pages
│   │   │   └── store/         # Store owner pages
│   │   ├── services/          # API service calls
│   │   │   ├── api.ts         # Base API configuration
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── store.service.ts
│   │   │   └── rating.service.ts
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── useStores.ts
│   │   │   └── useRatings.ts
│   │   ├── context/           # React Context providers
│   │   │   └── AuthContext.tsx
│   │   ├── types/             # TypeScript type definitions
│   │   │   ├── user.types.ts
│   │   │   ├── store.types.ts
│   │   │   └── rating.types.ts
│   │   ├── utils/             # Utility functions
│   │   │   ├── validators.ts  # Form validation logic
│   │   │   ├── constants.ts
│   │   │   └── helpers.ts
│   │   ├── App.tsx            # Main App component
│   │   ├── main.tsx           # Entry point
│   │   └── router.tsx         # Route configuration
│   ├── public/                # Public assets
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                    # Next.js API Backend
│   ├── src/
│   │   ├── pages/
│   │   │   └── api/           # API routes
│   │   │       ├── auth/
│   │   │       │   ├── login.ts
│   │   │       │   ├── signup.ts
│   │   │       │   ├── logout.ts
│   │   │       │   └── change-password.ts
│   │   │       ├── users/
│   │   │       │   ├── index.ts        # GET all users
│   │   │       │   ├── create.ts       # POST new user
│   │   │       │   └── [id].ts         # GET/PUT/DELETE user
│   │   │       ├── stores/
│   │   │       │   ├── index.ts        # GET all stores
│   │   │       │   ├── create.ts       # POST new store
│   │   │       │   ├── [id].ts         # GET/PUT/DELETE store
│   │   │       │   └── [id]/
│   │   │       │       └── ratings.ts  # GET ratings for store
│   │   │       ├── ratings/
│   │   │       │   ├── index.ts        # GET all ratings
│   │   │       │   ├── submit.ts       # POST new rating
│   │   │       │   └── [id].ts         # PUT/DELETE rating
│   │   │       └── dashboard/
│   │   │           ├── admin-stats.ts  # Admin dashboard data
│   │   │           └── store-stats.ts  # Store owner dashboard
│   │   ├── lib/               # Utility libraries
│   │   │   ├── supabase.ts    # Supabase client config
│   │   │   ├── auth.ts        # Authentication helpers
│   │   │   └── validation.ts  # Server-side validation
│   │   ├── middleware/        # API middleware
│   │   │   ├── auth.middleware.ts
│   │   │   ├── role.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── types/             # TypeScript definitions
│   │   │   ├── api.types.ts
│   │   │   └── models.types.ts
│   │   └── utils/             # Helper functions
│   │       ├── error-handler.ts
│   │       └── response.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
│
├── database/                   # Database schema and migrations
│   ├── schema.sql             # Database schema
│   ├── migrations/            # Migration files
│   └── seeds/                 # Seed data
│
├── .gitignore
├── README.md
└── docker-compose.yml         # Optional: for local development
```

## 🗄️ Database Schema

### Tables

#### users
```sql
- id (UUID, Primary Key)
- name (VARCHAR(60))
- email (VARCHAR(255), Unique)
- password_hash (VARCHAR(255))
- address (VARCHAR(400))
- role (ENUM: 'admin', 'user', 'store_owner')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### stores
```sql
- id (UUID, Primary Key)
- owner_id (UUID, Foreign Key -> users.id)
- name (VARCHAR(60))
- email (VARCHAR(255))
- address (VARCHAR(400))
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### ratings
```sql
- id (UUID, Primary Key)
- user_id (UUID, Foreign Key -> users.id)
- store_id (UUID, Foreign Key -> stores.id)
- rating (INTEGER, 1-5)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- UNIQUE constraint on (user_id, store_id)
```

## 🔄 Application Flow

### 1. Authentication Flow
```
User Access → Login/Signup Page → Credential Validation → Supabase Auth
→ JWT Token Generation → Role-based Redirect → Dashboard
```

### 2. User Registration Flow (Normal Users)
```
Signup Page → Form Validation → API: /api/auth/signup → Create User in DB
→ Send Confirmation Email → Auto Login → User Dashboard
```

### 3. Rating Submission Flow
```
User Dashboard → Browse Stores → Select Store → Submit Rating (1-5)
→ API: /api/ratings/submit → Validate & Save → Update Store Average
→ Show Success Message → Refresh Store List
```

### 4. Admin Store Creation Flow
```
Admin Dashboard → Add Store → Fill Form → API: /api/stores/create
→ Create Store Owner User → Create Store Entry → Link Owner
→ Show Success → Refresh Store List
```

### 5. Store Owner Dashboard Flow
```
Store Owner Login → Dashboard → API: /api/dashboard/store-stats
→ Fetch Ratings & Users → Display Average Rating → Show User List
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account

### 1. Clone Repository
```bash
git clone <repository-url>
cd store-rating-platform
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env.local file
cat > .env.local << EOL
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
EOL

# Run development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env file
cat > .env << EOL
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
EOL

# Run development server
npm run dev
```

### 4. Database Setup

#### Option A: Using Supabase Dashboard
1. Log in to your Supabase project
2. Navigate to SQL Editor
3. Run the schema from `database/schema.sql`
4. Run seed data from `database/seeds/`

#### Option B: Using Migration Files
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

### 5. Create Default Admin User

Run this SQL in Supabase SQL Editor:
```sql
INSERT INTO users (name, email, password_hash, address, role)
VALUES (
  'System Administrator',
  'admin@example.com',
  -- Use bcrypt to hash 'Admin@123'
  '$2a$10$...',
  '123 Admin Street, City',
  'admin'
);
```

## 🔐 Environment Variables

### Backend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_random_jwt_secret
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🧪 Testing

### Run Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📝 Form Validations

- **Name**: 20-60 characters
- **Email**: Valid email format (RFC 5322)
- **Password**: 8-16 characters, at least one uppercase letter and one special character
- **Address**: Maximum 400 characters
- **Rating**: Integer between 1-5

## 🚦 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/change-password` - Update password

### Users (Admin only)
- `GET /api/users` - List all users (with filters)
- `POST /api/users/create` - Create new user
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Stores
- `GET /api/stores` - List all stores (with search)
- `POST /api/stores/create` - Create store (Admin)
- `GET /api/stores/:id` - Get store details
- `GET /api/stores/:id/ratings` - Get store ratings

### Ratings
- `POST /api/ratings/submit` - Submit/Update rating
- `GET /api/ratings` - Get user's ratings
- `DELETE /api/ratings/:id` - Delete rating

### Dashboard
- `GET /api/dashboard/admin-stats` - Admin statistics
- `GET /api/dashboard/store-stats` - Store owner statistics

## 🎨 UI Components

### Common Components
- Button, Input, Select, Textarea
- Modal, Toast, Loader
- DataTable with sorting and filtering
- Rating Stars (interactive)
- SearchBar, FilterPanel
- Card, Badge, Avatar

## 🔒 Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Role-based access control (RBAC)
- Input sanitization
- SQL injection prevention (Supabase handles this)
- XSS protection
- CORS configuration

## 📦 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy dist/ folder
```

### Backend (Vercel)
```bash
cd backend
# Deploy using Vercel CLI or GitHub integration
vercel --prod
```

### Database
- Supabase is cloud-hosted (no deployment needed)
- Ensure production environment variables are set

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Supabase for backend infrastructure
- Next.js team for the amazing framework
- React and Vite communities