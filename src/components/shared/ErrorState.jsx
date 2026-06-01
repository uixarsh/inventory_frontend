import { AlertCircle } from "lucide-react";

export default function ErrorState({ error }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-destructive">
      <AlertCircle className="w-12 h-12 mb-4 opacity-80" />
      <h3 className="text-lg font-semibold mb-1">Failed to load data</h3>
      <p className="text-sm opacity-80">{error?.message || "An unknown error occurred"}</p>
    </div>
  );
}
