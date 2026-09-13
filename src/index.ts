import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postsRoute from './routes/posts/posts.route';
import authRoute from './routes/auth/auth.route';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Berhasil jalan');
});

app.use('/api/auth', authRoute);
app.use('/api/posts', postsRoute);

app.listen(PORT, () => {
  console.log(`Server berhasil berjalan di http://localhost:${PORT}`);
});
