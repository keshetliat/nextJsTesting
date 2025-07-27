"use client";

import { useState } from "react";

interface DebugToggleProps {
  onToggle: (isEnabled: boolean) => void;
}

export function DebugToggle({ onToggle }: DebugToggleProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    onToggle(newState);
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={handleToggle}
        className={`px-3 py-1 rounded text-xs font-mono ${
          isEnabled 
            ? 'bg-green-600 text-white' 
            : 'bg-gray-600 text-white'
        }`}
      >
        {isEnabled ? 'DEBUG ON' : 'DEBUG OFF'}
      </button>
    </div>
  );
} 