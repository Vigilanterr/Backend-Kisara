import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/postRoutes';
import categoryRoutes from './routes/categoriesRoutes';
import commentRoutes from './routes/commentRoutes';
import commentDeleteRoutes from './routes/commentDeleteRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import likeRoutes from './routes/likeRoutes';
import saveRoutes from './routes/saveRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Berhasil jalan');
});

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts', likeRoutes);
app.use('/api/posts', saveRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', commentRoutes);
app.use('/api/comments', commentDeleteRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server berhasil berjalan di http://localhost:${PORT}`);
});
