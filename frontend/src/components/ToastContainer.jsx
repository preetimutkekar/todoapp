// components/ToastContainer.jsx
import React, { useEffect } from 'react';

const ToastContainer = ({ toasts, removeToast }) => {
  // Auto-remove toasts after 5 seconds
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [toasts, removeToast]);

  // Map toast type to appropriate color
  const getToastClasses = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-700';
      case 'error':
        return 'bg-red-500 border-red-700';
      case 'warning':
        return 'bg-amber-500 border-amber-700';
      default:
        return 'bg-blue-500 border-blue-700';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2"> {/* Changed top-5 to bottom-5 */}
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-lg border-l-4 px-4 py-3 shadow-md ${getToastClasses(toast.type)} text-white min-w-[280px] max-w-md transform transition-all duration-500 animate-slide-in`}
        >
          <div className="flex justify-between items-center">
            <p className="font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;