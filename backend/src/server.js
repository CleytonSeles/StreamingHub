import app from './app.js'

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📝 Health check: http://localhost:${PORT}/health`);
    console.log(`🔐 Auth endpoint: http://localhost:${PORT}/auth/spotify`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully');
  process.exit(0);
});