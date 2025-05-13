// Replace 'import' with 'require'
const express = require('express');
const { getTodos, addTodo, updateTodo, deleteTodo } = require('../controllers/todoController.js');

const router = express.Router();

router.get('/', getTodos);
router.post('/', addTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

// Use 'module.exports' instead of 'export default'
module.exports = router;
