import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/postRoutes';
import categoryRoutes from './routes/categoriesRoutes';
import commentRoutes from './routes/commentRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Berhasil jalan');
});

app.use('/api/posts', postRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/posts', commentRoutes);

app.listen(PORT, () => {
  console.log(`Server berhasil berjalan di http://localhost:${PORT}`);
});