# mktoolnest

A premium blogging platform featuring three specialized topics:
- **Baybolt**: Tips & Tools for Mechanics
- **HugLoom**: Tips & Tools for Caretakers  
- **Day Labor on Demand**: Tips & Tools for Contractors

## Features

- 🎨 Premium dark mode design with glassmorphism
- 📱 Fully responsive layout
- 🔐 Secure admin dashboard
- ✍️ Easy content management
- 🚀 Built with Next.js 15 and Supabase
- 🎯 SEO optimized

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Mkobilan/mktoolnest.git
cd mktoolnest
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables:
Create a `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Set up the database:
Follow the instructions in `DATABASE_SETUP.md`

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## Admin Access

- URL: `/admin/login`
- Email: `matthew.kobilan@gmail.com`
- Password: `Think400Big!`

## Project Structure

```
src/
├── app/
│   ├── [topic]/          # Dynamic topic pages
│   ├── admin/            # Admin dashboard
│   ├── blog/[slug]/      # Individual blog posts
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── utils/
│   └── supabase/         # Supabase client helpers
└── middleware.ts         # Route protection
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables
4. Deploy!

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Vanilla CSS with CSS Variables
- **Icons**: Lucide React
- **Language**: TypeScript

## License

MIT
