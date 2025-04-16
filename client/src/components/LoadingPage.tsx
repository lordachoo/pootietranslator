import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingPageProps {
  message?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <LoadingSpinner size="large" message={message} />
      </div>
    </div>
  );
};

export default LoadingPage;