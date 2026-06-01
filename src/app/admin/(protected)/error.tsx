"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ProtectedAdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="admin-error-shell" role="alert">
      <div className="admin-error-icon">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h1 className="admin-error-title">Unable to load this admin view</h1>
      <p className="admin-error-copy">
        {error.message || "The backend did not return the data needed for this screen."}
      </p>
      <button onClick={reset} className="createbtn">
        <RefreshCw className="h-4 w-4" />
        Try again
      </button>
    </div>
  );
}
