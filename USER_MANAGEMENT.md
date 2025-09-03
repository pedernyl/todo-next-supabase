# User Management Feature

This document explains how to use the user ID retrieval functionality that has been added to the todo app.

## Overview

When a user logs in through GitHub OAuth, their information is automatically synchronized with a Supabase `users` table. This allows you to get the user's ID from the database based on their email.

## Database Schema

The `users` table should have the following structure in Supabase:

```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Usage

### 1. Getting User ID in Components

Use the provided hooks to get user information in React components:

```tsx
import { useUserId, useUserEmail, useUserInfo } from '../hooks/useUser';

export default function MyComponent() {
  const userId = useUserId();
  const userEmail = useUserEmail();
  const { userId: id, email } = useUserInfo();

  if (userId) {
    return <div>Current user ID: {userId}</div>;
  }

  return <div>User not logged in</div>;
}
```

### 2. Getting User ID in Server Components

```tsx
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/authOptions";

export default async function ServerComponent() {
  const session = await getServerSession(authOptions);
  
  if (session?.userId) {
    return <div>User ID: {session.userId}</div>;
  }
  
  return <div>No user logged in</div>;
}
```

### 3. Getting User ID in API Routes

```tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../lib/authOptions";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  // Use session.userId to query user-specific data
  return NextResponse.json({ userId: session.userId });
}
```

### 4. Direct Database Queries

Use the provided functions for direct database access:

```tsx
import { getUserByEmail, getOrCreateUser, getCurrentUserId } from '../lib/dataService';

// Get user by email
const user = await getUserByEmail('user@example.com');

// Get or create user (useful for ensuring user exists)
const user = await getOrCreateUser('user@example.com', 'User Name');

// Get just the user ID
const userId = await getCurrentUserId('user@example.com');
```

## How It Works

1. **Sign In**: When a user signs in through GitHub OAuth, the `signIn` callback in `authOptions.ts` automatically creates or retrieves the user record in Supabase.

2. **JWT Token**: The user's ID is stored in the JWT token during the `jwt` callback.

3. **Session**: The user ID is added to the session object during the `session` callback, making it available throughout the application.

4. **Automatic Sync**: Users are automatically synchronized with Supabase on every successful sign-in, ensuring the local database stays up-to-date.

## Benefits

- **Single Source of Truth**: User IDs are consistent between NextAuth sessions and Supabase database
- **Automatic Sync**: No manual user creation needed
- **Type Safe**: Full TypeScript support with proper type definitions
- **Easy Access**: Multiple convenient ways to access user ID throughout the application
- **Server & Client**: Works in both server components and client components