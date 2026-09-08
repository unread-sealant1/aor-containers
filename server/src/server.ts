import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Error: Port ${PORT} is already in use.`);
    process.exit(1);
  }

  console.error('❌ Server startup error:', error);
  process.exit(1);
});
