import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoute from './routes/auth/auth.route';
import postsRoute from './routes/posts/posts.route';
import categoriesRoute from './routes/categories/categories.route';
import usersRoute from './routes/users/users.route';
import commentsRoute from './routes/comments/comments.route';
import likesRoute from './routes/likes/likes.route';
import savesRoute from './routes/saves/saves.route';

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
app.use('/api/posts', commentsRoute);
app.use('/api/posts', likesRoute);
app.use('/api/posts', savesRoute);
app.use('/api/categories', categoriesRoute);
app.use('/api/users', usersRoute);

app.listen(PORT, () => {
  console.log(`Server berhasil berjalan di http://localhost:${PORT}`);
});
