import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-slate-400 text-lg bg-slate-900">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
