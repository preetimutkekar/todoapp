
const Todo = require('../models/Todo.js');


const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Failed to fetch todos' });
  }
};

const addTodo = async (req, res) => {
  try {
    const { clientId, ...todoData } = req.body;
    const todo = await Todo.create(todoData);
   
    req.io.emit('todo_added', todo, clientId);
    res.status(201).json(todo);
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ message: 'Failed to add todo' });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId, ...todoData } = req.body;
    const updated = await Todo.findByIdAndUpdate(id, todoData, { new: true });
   
    req.io.emit('todo_updated', updated, clientId);
    res.json(updated);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ message: 'Failed to update todo' });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientId, text } = req.query;
    
    await Todo.findByIdAndDelete(id);
   
    req.io.emit('todo_deleted', id, text, clientId);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ message: 'Failed to delete todo' });
  }
};


module.exports = {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo
};