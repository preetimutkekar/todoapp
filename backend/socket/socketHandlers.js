// socket/socketHandlers.js
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // You can add more event listeners here

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
