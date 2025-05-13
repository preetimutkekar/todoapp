
import React, { useState } from 'react';

const TodoItem = ({ todo, onUpdateTodo, onDeleteTodo, startEditing }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const toggleComplete = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    
    try {
      await onUpdateTodo(todo._id, {
        ...todo,
        completed: !todo.completed,
      });
     
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteTodo = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    
    try {
      await onDeleteTodo(todo._id, todo.text);
      
    } catch (error) {
      console.error('Error deleting todo:', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-lg shadow-lg transition-colors duration-300 ${isDeleting ? 'bg-red-100 dark:bg-red-900' : 'bg-gray-50 dark:bg-gray-800'}`}> {/* Updated padding and shadow */}
      <div className="flex items-center flex-grow mr-4">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={toggleComplete}
          disabled={isUpdating}
          className="mr-3 h-6 w-6 text-blue-600 cursor-pointer rounded-lg" 
        />
        <span
          className={`cursor-pointer text-lg ${todo.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'dark:text-white'}`} /* Increased font size */
          onClick={toggleComplete}
        >
          {todo.text}
        </span>
      </div>
      <div className="flex space-x-2"> 
        <button 
          onClick={deleteTodo} 
          disabled={isDeleting}
          className="px-5 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 dark:from-red-400 dark:to-red-500 dark:hover:from-red-500 dark:hover:to-red-600 transition-all shadow-md" /* Updated gradient background, rounded-full, and shadow */
        >
          {isDeleting ? 'Removing...' : 'Delete'}
        </button>
        <button
          onClick={() => startEditing(todo)}
          className="px-5 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 dark:from-blue-400 dark:to-blue-500 dark:hover:from-blue-500 dark:hover:to-blue-600 transition-all shadow-md" /* Updated gradient background, rounded-full, and shadow */
        >
          Edit
        </button>
      </div>
    </div>
  );
};

export default TodoItem;