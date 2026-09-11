import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const categoriesTable = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const postsTable = pgTable('posts', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id')
    .references(() => categoriesTable.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content').notNull(),
  image: text('image'),
  author: varchar('author', { length: 100 }).default('Anonim'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});