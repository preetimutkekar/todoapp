// components/Home.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import ToastContainer from './ToastContainer';

let socket;
const clientId = Math.random().toString(36).substring(2, 15); // Unique ID

const Home = () => {
  const [todos, setTodos] = useState([]);
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState({ all: 0, active: 0, completed: 0 });
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    if (!socket) {
      socket = io('http://localhost:5000', {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        query: { clientId }
      });
    }

    socket.on('connect', () => {
      setConnected(true);
      fetchTodos();
      addToast('Connected to real-time updates', 'success');
    });

    socket.on('connect_error', (err) => {
      if (!connected) {
        fetchTodos();
        addToast('Using standard mode - real-time updates unavailable', 'warning');
      }
    });

    socket.on('todo_added', (todo, source) => {
      if (source !== clientId) {
        addToast(`Someone added a new task: "${todo.text}"`, 'success');
      }
      const updated = [todo, ...todos];
      setTodos(updated);
      updateStats(updated);
    });

    socket.on('todo_updated', (updated, source) => {
      if (source !== clientId) {
        addToast(
          updated.completed
            ? `Someone completed the task: "${updated.text}"`
            : `Someone updated the task: "${updated.text}"`,
          'info'
        );
      }
      const updatedTodos = todos.map(todo =>
        todo._id === updated._id ? updated : todo
      );
      setTodos(updatedTodos);
      updateStats(updatedTodos);
    });

    socket.on('todo_deleted', (id, todoText, source) => {
      if (source !== clientId) {
        addToast(`Someone deleted a task${todoText ? `: "${todoText}"` : ''}`, 'warning');
      }
      const filtered = todos.filter(todo => todo._id !== id);
      setTodos(filtered);
      updateStats(filtered);
    });

    return () => {
      socket.off('connect');
      socket.off('connect_error');
      socket.off('todo_added');
      socket.off('todo_updated');
      socket.off('todo_deleted');
    };
  }, [todos, connected]);

  const updateStats = (todosArray) => {
    const completed = todosArray.filter(todo => todo.completed).length;
    const all = todosArray.length;
    const active = all - completed;
    setStats({ all, active, completed });
  };

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/todos');
      setTodos(res.data);
      updateStats(res.data);
    } catch (err) {
      addToast('Failed to fetch tasks. Please try again.', 'error');
    }
  };

  const addTodo = async (text) => {
    try {
      const res = await axios.post('http://localhost:5000/api/todos', {
        text: text.trim(),
        completed: false,
        clientId
      });
      addToast(`TODO added: "${text.trim()}"`, 'success');
      return true;
    } catch (err) {
      addToast('Failed to add task. Please try again.', 'error');
      return false;
    }
  };

  const updateTodo = async (id, updates) => {
    try {
      await axios.put(`http://localhost:5000/api/todos/${id}`, {
        ...updates,
        clientId
      });
      if (updates.hasOwnProperty('completed')) {
        addToast(updates.completed ? 'TODO marked as completed' : 'TODO marked as active', 'info');
      } else if (updates.hasOwnProperty('text')) {
        addToast(`TODO updated to: "${updates.text}"`, 'info');
      }
      return true;
    } catch (err) {
      addToast('Failed to update TODO. Please try again.', 'error');
      return false;
    }
  };

  const deleteTodo = async (id, text) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}?clientId=${clientId}&text=${encodeURIComponent(text)}`);
      addToast(`TODO deleted: "${text}"`, 'warning');
      return true;
    } catch (err) {
      addToast('Failed to delete TODO. Please try again.', 'error');
      return false;
    }
  };

  const filteredTodos = () => {
    let baseList = todos;
    if (filter === 'active') baseList = baseList.filter(todo => !todo.completed);
    else if (filter === 'completed') baseList = baseList.filter(todo => todo.completed);

    return baseList.filter(todo =>
      todo.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="pt-40 px-6 sm:px-10 md:px-14 lg:px-20 pb-10 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-500">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Animated Todo Image */}
      <div className="flex justify-center mb-8">
        <img
          src="https://cdn-icons-png.flaticon.com/512/942/942748.png"
          alt="Todo Illustration"
          className="w-36 h-36 object-contain dark:invert animate-bounce"
        />
      </div>

      {!connected && (
        <div className="text-center mb-4 text-yellow-600 dark:text-yellow-400">
          Real-time updates unavailable. Using standard mode.
        </div>
      )}

      {/* Form Section */}
      <div className="max-w-2xl mx-auto mb-8">
        <TodoForm onAddTodo={addTodo} />
      </div>

      {/* Stats Section */}
      <div className="max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-300 dark:via-purple-300 dark:to-pink-300 animate-gradient-text font-serif tracking-wide">
  🚀 Task Status
</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <h3 className="text-lg font-medium text-blue-500 dark:text-blue-300">All Tasks</h3>
            <p className="text-2xl font-semibold mt-2 text-gray-800 dark:text-white">{stats.all}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <h3 className="text-lg font-medium text-yellow-500 dark:text-yellow-300">Active</h3>
            <p className="text-2xl font-semibold mt-2 text-gray-800 dark:text-white">{stats.active}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
            <h3 className="text-lg font-medium text-green-500 dark:text-green-300">Completed</h3>
            <p className="text-2xl font-semibold mt-2 text-gray-800 dark:text-white">{stats.completed}</p>
          </div>
        </div>
      </div>

      {/* 🔍 Search Bar */}
      <div className="max-w-2xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg shadow text-gray-800 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter Buttons */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex justify-center gap-4">
          <button
            className={`px-4 py-2 rounded-full font-medium shadow ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
            onClick={() => setFilter('all')}
          >
            All Tasks
          </button>
          <button
            className={`px-4 py-2 rounded-full font-medium shadow ${
              filter === 'active'
                ? 'bg-yellow-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 rounded-full font-medium shadow ${
              filter === 'completed'
                ? 'bg-green-500 text-white'
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white'
            }`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Todo List */}
      <div className="max-w-2xl mx-auto space-y-6">
        <TodoList
          todos={filteredTodos()}
          onUpdateTodo={updateTodo}
          onDeleteTodo={deleteTodo}
        />
        {filteredTodos().length === 0 && (
          <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <p className="text-gray-600 dark:text-gray-400">No {filter !== 'all' ? filter : ''} tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
