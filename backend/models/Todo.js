// Replace 'import' with 'require'
const mongoose = require('mongoose');

// Define the schema for Todo
const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

// Export the model using 'module.exports'
module.exports = mongoose.model('Todo', todoSchema);
