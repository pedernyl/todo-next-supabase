'use client';

import { useUserId, useUserEmail, useUserInfo } from '../hooks/useUser';

/**
 * Example component that demonstrates how to use the user ID functionality
 */
export default function UserInfoExample() {
  const userId = useUserId();
  const userEmail = useUserEmail();
  // Demonstrating useUserInfo hook (alternative way to get both values)
  const userInfo = useUserInfo();

  if (!userId) {
    return (
      <div className="max-w-xl mx-auto p-4 bg-yellow-100 rounded-lg mb-6">
        <h3 className="font-semibold text-yellow-800">User Not Logged In</h3>
        <p className="text-yellow-700">Please log in to see your user information.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4 bg-blue-100 rounded-lg mb-6">
      <h3 className="font-semibold text-blue-800 mb-2">User Information</h3>
      <div className="space-y-2 text-blue-700">
        <div>
          <span className="font-medium">User ID:</span> {userId}
        </div>
        <div>
          <span className="font-medium">Email:</span> {userEmail}
        </div>
        <div className="text-sm mt-3 p-2 bg-blue-50 rounded">
          <strong>Note:</strong> This user ID comes from the Supabase users table and is 
          automatically synchronized when you log in through GitHub OAuth.
          <br /><br />
          <strong>Alternative:</strong> You can also use <code>useUserInfo()</code> to get both 
          values at once: {JSON.stringify(userInfo)}
        </div>
      </div>
    </div>
  );
}