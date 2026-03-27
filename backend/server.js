import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import incidentRoutes from './routes/incidents.js';
// =================================================================================================
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// =================================================================================================
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// =================================================================================================
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
// =================================================================================================
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});
// =================================================================================================
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});