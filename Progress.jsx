// components/ui/Progress.jsx
import React from 'react';

export const Progress = ({ value }) => (
  <div className="w-full h-3 bg-gray-200 rounded-full">
    <div
      className="h-full bg-green-500 rounded-full"
      style={{ width: `${value}%` }}
    />
  </div>
);