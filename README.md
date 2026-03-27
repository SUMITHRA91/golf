# Golf Charity Subscription Platform

A modern subscription-based platform combining golf performance tracking, charity fundraising, and monthly prize draws. Built with React, Vite, Tailwind CSS, and Supabase.

## Features

### For Users
- **Subscription Management**: Monthly and yearly subscription plans
- **Score Tracking**: Track your latest 5 golf scores in Stableford format (1-45)
- **Monthly Draws**: Participate in draws with 3, 4, and 5-number matches
- **Charity Support**: Choose and support a charity with at least 10% of your subscription
- **User Dashboard**: Manage scores, charity selection, and subscription

### For Administrators
- **User Management**: View and manage platform users
- **Draw System**: Create and run monthly draws (random or algorithmic)
- **Charity Management**: Add, edit, and feature charities
- **Winner Verification**: Review and approve winner submissions
- **Analytics**: View platform statistics and insights

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   cd golf-charity-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - The database schema has already been created via migrations
   - Sample charities have been added automatically

4. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   You can find these values in your Supabase project settings under API.

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Database Schema

The platform uses the following main tables:

- **profiles**: User profile information
- **subscriptions**: User subscription records
- **charities**: Charity organizations
- **user_charities**: User charity selections and contribution percentages
- **scores**: Golf scores (latest 5 per user)
- **draws**: Monthly draw configurations and results
- **draw_participants**: User participation in draws
- **winner_verifications**: Winner proof submissions
- **payments**: Prize payout tracking
- **charity_contributions**: Charity donation records
- **admin_users**: Admin role assignments

All tables have Row Level Security (RLS) enabled for data protection.

## Creating an Admin User

To create an admin user:

1. Sign up for an account through the UI
2. Get your user ID from Supabase dashboard (Auth > Users)
3. Run this SQL in the Supabase SQL Editor:
   ```sql
   INSERT INTO admin_users (id, role)
   VALUES ('your-user-id-here', 'admin');
   ```

## Usage

### For Users

1. **Sign Up**: Create an account with email and password
2. **Subscribe**: Choose monthly ($19) or yearly ($199) plan
3. **Select Charity**: Pick a charity and set contribution percentage (min 10%)
4. **Add Scores**: Enter your latest golf scores (Stableford format)
5. **Participate**: Automatically entered into monthly draws
6. **Win Prizes**: Check dashboard for draw results and winnings

### For Admins

1. **Access Admin Panel**: Click "Admin" in the header (only visible to admin users)
2. **Manage Charities**: Add new charities or feature existing ones
3. **Run Draws**: Create and publish monthly draws
4. **Verify Winners**: Review winner proof submissions
5. **View Analytics**: Monitor platform statistics

## Prize Pool Distribution

- **5-Number Match**: 40% of pool (jackpot - rolls over if unclaimed)
- **4-Number Match**: 35% of pool
- **3-Number Match**: 25% of pool

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin dashboard components
│   ├── auth/           # Authentication forms
│   ├── dashboard/      # User dashboard components
│   └── layout/         # Layout components (Header)
├── contexts/           # React contexts (AuthContext)
├── lib/                # Utilities (Supabase client)
├── pages/              # Main pages
│   ├── HomePage.tsx
│   ├── HowItWorksPage.tsx
│   ├── CharitiesPage.tsx
│   ├── UserDashboard.tsx
│   └── AdminDashboard.tsx
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## Key Features Implementation

### Score Management
- Users can maintain exactly 5 scores
- Adding a 6th score automatically removes the oldest
- Scores displayed in reverse chronological order
- Valid range: 1-45 (Stableford format)

### Draw System
- Monthly draws using 5 numbers
- Two modes: Random or Algorithmic (weighted by score frequency)
- Jackpot rollover for 5-match prizes
- Prize distribution automatically calculated

### Charity System
- Public charity directory with search
- Featured charity spotlight
- Flexible contribution percentage (10-100%)
- Upcoming events display

### Security
- Row Level Security on all database tables
- Email/password authentication
- Protected admin routes
- Secure data access patterns

## License

This project was created as a sample assignment for the Digital Heroes Full-Stack Development Trainee Selection Process.

## Support

For questions or issues, please refer to the PRD document or contact Digital Heroes at digitalheroes.co.in
