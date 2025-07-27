"use client";

interface DebugPanelProps {
  data: any;
  title?: string;
  isVisible?: boolean;
}

export function DebugPanel({ data, title = "Debug Info", isVisible = false }: DebugPanelProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-md max-h-96 overflow-auto z-50">
      <h3 className="font-bold mb-2">{title}</h3>
      <pre className="text-xs whitespace-pre-wrap">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
} 