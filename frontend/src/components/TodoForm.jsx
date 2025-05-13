
import React, { useState } from 'react';

const TodoForm = ({ onAddTodo }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const success = await onAddTodo(text);
      if (success) {
        setText('');
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex mb-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="p-2 flex-grow border border-gray-300 dark:border-gray-600 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        placeholder="Add new todo"
        aria-label="Add new todo"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className={`bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-500 ${isSubmitting ? 'opacity-75' : 'animate-pulse hover:animate-none'}`}
        aria-label="Add todo"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
};

export default TodoForm;