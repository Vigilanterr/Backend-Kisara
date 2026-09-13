import { pgTable, serial, varchar, text, integer, timestamp, unique } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  picture: text('picture'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const categoriesTable = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const postsTable = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  categoryId: integer('category_id')
    .references(() => categoriesTable.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  picture: text('picture'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const commentsTable = pgTable('comments', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  postId: integer('post_id')
    .references(() => postsTable.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const postLikesTable = pgTable('post_likes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  postId: integer('post_id')
    .references(() => postsTable.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => [
  unique().on(t.userId, t.postId),
]);

export const savedPostsTable = pgTable('saved_posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => usersTable.id, { onDelete: 'cascade' })
    .notNull(),
  postId: integer('post_id')
    .references(() => postsTable.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
}, (t) => [
  unique().on(t.userId, t.postId),
]);
