# Crescent

Crescent is a Next.js application for education management, providing tools for students, parents, and teachers.

## Getting Started

First, set up the environment:

```bash
# Install dependencies
npm install

# Set up the database
npx prisma generate
npx prisma db push

# Seed the database with initial data
npx prisma db seed
```

Then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Testing

To run tests, use:

```bash
npm run test
```

For watching mode:

```bash
npm run test:watch
```

## Code Quality

To lint your code:

```bash
npm run lint
```

## Project Structure

- `src/app` - Next.js app router pages and API routes
- `src/components` - Reusable React components
- `src/hooks` - Custom React hooks
- `src/lib` - Utility functions and library configurations
- `prisma` - Database schema and migrations

## Key Features

- Authentication with NextAuth.js
- Student, parent, and teacher roles
- Course and book viewing
- Note-taking system with Zettelkasten features
- Feedback system for teachers
- Analytics for tracking student progress

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deployment

This application can be deployed on platforms like Vercel, AWS, or any other hosting service that supports Next.js applications.
