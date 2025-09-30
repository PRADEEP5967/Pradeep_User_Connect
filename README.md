# Store Rating Platform 🌟

A comprehensive web application for rating and managing stores with role-based access control, advanced analytics, and modern features.

**Project URL**: https://lovable.dev/projects/6491d561-95c5-4aa6-b10e-b44a811b87ed

## 🎯 Overview

This platform allows users to submit ratings for stores (1-5 stars) with a sophisticated role-based access system:
- **System Administrator** - Manage users, stores, and view analytics
- **Normal User** - Browse and rate stores
- **Store Owner** - Monitor store performance and customer feedback

## 🔐 Quick Start - Default Login

**Admin Account:**
- Email: `admin@system.com`
- Password: `Admin123!`

*New users can register through the signup page. Admins can create additional accounts.*

## ✨ Core Features

### System Administrator Dashboard
- ✅ Add users (admin, normal user, store owner)
- ✅ Add and manage stores
- ✅ View platform statistics (users, stores, ratings)
- ✅ Advanced analytics with charts
- ✅ Bulk CSV import for users and stores
- ✅ Export data to CSV
- ✅ Sort and filter all listings
- ✅ Real-time notifications

### Normal User Dashboard
- ✅ Browse all stores with search and filters
- ✅ Submit ratings (1-5 stars)
- ✅ Update previous ratings
- ✅ Compare multiple stores
- ✅ Interactive map view
- ✅ Advanced search filters
- ✅ Password management

### Store Owner Dashboard
- ✅ View store rating analytics
- ✅ Monitor customer reviews
- ✅ Rating distribution charts
- ✅ Performance insights
- ✅ Password management

## 📋 Form Validations

- **Name:** 20-60 characters
- **Email:** Valid email format
- **Password:** 8-16 chars, uppercase + special character
- **Address:** Max 400 characters

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/6491d561-95c5-4aa6-b10e-b44a811b87ed) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## 🛠️ Technology Stack

- **Frontend:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with custom design system
- **UI Library:** shadcn/ui components
- **Charts:** Recharts for analytics
- **Icons:** Lucide React
- **Theme:** next-themes (dark/light mode)
- **Storage:** localStorage (no backend needed)

## 🎨 Modern Features

- **Advanced Analytics** - Growth charts, distribution graphs
- **Store Comparison** - Compare up to 4 stores side-by-side
- **Interactive Map** - Visual store locations with directions
- **Review System** - Comprehensive rating and review management
- **Bulk Operations** - CSV import/export functionality
- **Notifications** - Real-time system notifications
- **Theme Toggle** - Dark/light mode support
- **Responsive Design** - Mobile, tablet, and desktop optimized

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/6491d561-95c5-4aa6-b10e-b44a811b87ed) and click on Share -> Publish.

## 📁 Project Structure

```
src/
├── components/
│   ├── analytics/       # Charts and visualizations
│   ├── auth/           # Login/Register forms
│   ├── bulk/           # CSV import operations
│   ├── dashboards/     # Role-based dashboards
│   ├── layout/         # Layout components
│   ├── modern/         # Advanced features
│   ├── notifications/  # Notification system
│   ├── theme/          # Theme toggle
│   └── ui/            # Reusable components
├── contexts/          # React Context (Auth)
├── hooks/            # Custom hooks
├── types/            # TypeScript interfaces
├── utils/            # Utility functions
└── index.css         # Design system
```

## 💾 Data Storage

All data is stored in browser localStorage:
- `users` - User accounts
- `stores` - Store information
- `ratings` - User ratings
- `currentUser` - Active session

## 🚀 Development Commands

```sh
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
```

## 🌐 Can I connect a custom domain?

Yes! Navigate to Project > Settings > Domains and click Connect Domain.

Read more: [Custom Domain Setup](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 📚 Resources

- [Lovable Documentation](https://docs.lovable.dev/)
- [Troubleshooting Guide](https://docs.lovable.dev/tips-tricks/troubleshooting)
- [Community Discord](https://discord.com/channels/1119885301872070706/1280461670979993613)

---

**Built with ❤️ using Lovable**
