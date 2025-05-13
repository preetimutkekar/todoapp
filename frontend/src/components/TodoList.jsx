// components/TodoList.jsx
import React, { useState } from 'react';

const TodoList = ({ todos, onUpdateTodo, onDeleteTodo }) => {
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  const startEditing = (todo) => {
    setEditId(todo._id);
    setEditText(todo.text);
  };

  const saveEdit = async (id) => {
    if (editText.trim()) {
      const success = await onUpdateTodo(id, { text: editText.trim() });
      if (success) {
        setEditId(null);
        setEditText('');
      }
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  const handleToggle = async (todo) => {
    await onUpdateTodo(todo._id, { completed: !todo.completed });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition-all">
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="p-4 transition-transform hover:scale-[1.01] duration-200"
          >
            {editId === todo._id ? (
              <div className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  autoFocus
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => saveEdit(todo._id)}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text rounded font-bold border-2 border-transparent hover:border-purple-500 hover:scale-105 transition duration-200"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text rounded font-bold border-2 border-transparent hover:border-purple-500 hover:scale-105 transition duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                    className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span
                    className={`text-gray-800 dark:text-gray-200 transition ${
                      todo.completed
                        ? 'line-through text-gray-500 dark:text-gray-400'
                        : ''
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditing(todo)}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text rounded font-bold border-2 border-transparent hover:border-purple-500 hover:scale-105 transition duration-200 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDeleteTodo(todo._id, todo.text)}
                    className="px-3 py-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text rounded font-bold border-2 border-transparent hover:border-purple-500 hover:scale-105 transition duration-200 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
