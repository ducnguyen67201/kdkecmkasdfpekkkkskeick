import * as React from "react";

export function OctoLabIcon({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-blue-600 p-4 ${className ?? ""}`}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 6C16 6 12 8 12 12V20C12 24 16 26 16 26C16 26 20 24 20 20V12C20 8 16 6 16 6Z"
          fill="white"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="14" r="2" fill="#2563EB" />
        <path
          d="M13 18H19"
          stroke="#2563EB"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
