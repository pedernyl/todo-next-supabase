import AuthButtons from "../../components/AuthButtons";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">Sign in</h1>
        <p className="mb-4 text-gray-600">
          Please sign in to view your todos.
        </p>
        <AuthButtons />
      </div>
    </div>
  );
}
