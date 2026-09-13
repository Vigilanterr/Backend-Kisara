const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
  const client = await pool.connect();
  try {
    // 1. Buat users table
    console.log('1. Membuat users table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar(100) NOT NULL,
        "email" varchar(100) NOT NULL UNIQUE,
        "password" varchar(255) NOT NULL,
        "picture" text,
        "created_at" timestamp DEFAULT now()
      );
    `);
    console.log('   OK');

    // 2. Insert default admin user
    console.log('2. Insert admin user...');
    await client.query(`
      INSERT INTO "users" ("name", "email", "password")
      VALUES ('Admin', 'admin@blog.com', '$2b$10$placeholder')
      ON CONFLICT ("email") DO NOTHING;
    `);
    console.log('   OK');

    // 3. Cek apakah posts punya column user_id
    console.log('3. Cek posts columns...');
    const postsColumns = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'posts' AND column_name = 'user_id';
    `);
    if (postsColumns.rows.length === 0) {
      console.log('   Menambahkan user_id ke posts...');
      await client.query(`ALTER TABLE "posts" ADD COLUMN "user_id" integer;`);
      await client.query(`
        ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;
      `);
      // Set default user_id untuk posts existing
      await client.query(`
        UPDATE "posts" SET "user_id" = (SELECT "id" FROM "users" WHERE "email" = 'admin@blog.com' LIMIT 1)
        WHERE "user_id" IS NULL;
      `);
      console.log('   OK');
    } else {
      console.log('   user_id sudah ada');
    }

    // 4. Cek apakah posts punya column picture (bukan image)
    console.log('4. Cek posts picture column...');
    const postsPicture = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'posts' AND column_name = 'picture';
    `);
    const postsImage = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'posts' AND column_name = 'image';
    `);
    if (postsPicture.rows.length === 0) {
      console.log('   Menambahkan picture ke posts...');
      await client.query(`ALTER TABLE "posts" ADD COLUMN "picture" text;`);
      // Copy data dari image ke picture jika ada
      if (postsImage.rows.length > 0) {
        await client.query(`UPDATE "posts" SET "picture" = "image" WHERE "image" IS NOT NULL;`);
      }
      console.log('   OK');
    } else {
      console.log('   picture sudah ada');
    }

    // 5. Cek apakah comments punya column user_id
    console.log('5. Cek comments columns...');
    const commentsColumns = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'comments' AND column_name = 'user_id';
    `);
    if (commentsColumns.rows.length === 0) {
      console.log('   Menambahkan user_id ke comments...');
      // Set default user_id dulu sebelum add constraint
      await client.query(`ALTER TABLE "comments" ADD COLUMN "user_id" integer;`);
      await client.query(`
        UPDATE "comments" SET "user_id" = (SELECT "id" FROM "users" WHERE "email" = 'admin@blog.com' LIMIT 1)
        WHERE "user_id" IS NULL;
      `);
      await client.query(`
        ALTER TABLE "comments" ALTER COLUMN "user_id" SET NOT NULL;
      `);
      await client.query(`
        ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;
      `);
      console.log('   OK');
    } else {
      console.log('   user_id sudah ada');
    }

    // 6. Buat post_likes table
    console.log('6. Membuat post_likes table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "post_likes" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "post_id" integer NOT NULL,
        "created_at" timestamp DEFAULT now(),
        CONSTRAINT "post_likes_user_id_post_id_unique" UNIQUE ("user_id", "post_id")
      );
    `);
    // Add FK constraints if not exist
    const postLikesFkUser = await client.query(`
      SELECT constraint_name FROM information_schema.table_constraints
      WHERE table_name = 'post_likes' AND constraint_name = 'post_likes_user_id_users_id_fk';
    `);
    if (postLikesFkUser.rows.length === 0) {
      await client.query(`
        ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_user_id_users_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;
      `);
    }
    const postLikesFkPost = await client.query(`
      SELECT constraint_name FROM information_schema.table_constraints
      WHERE table_name = 'post_likes' AND constraint_name = 'post_likes_post_id_posts_id_fk';
    `);
    if (postLikesFkPost.rows.length === 0) {
      await client.query(`
        ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_post_id_posts_id_fk"
        FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade;
      `);
    }
    console.log('   OK');

    // 7. Buat saved_posts table
    console.log('7. Membuat saved_posts table...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "saved_posts" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "post_id" integer NOT NULL,
        "created_at" timestamp DEFAULT now(),
        CONSTRAINT "saved_posts_user_id_post_id_unique" UNIQUE ("user_id", "post_id")
      );
    `);
    const savedFkUser = await client.query(`
      SELECT constraint_name FROM information_schema.table_constraints
      WHERE table_name = 'saved_posts' AND constraint_name = 'saved_posts_user_id_users_id_fk';
    `);
    if (savedFkUser.rows.length === 0) {
      await client.query(`
        ALTER TABLE "saved_posts" ADD CONSTRAINT "saved_posts_user_id_users_id_fk"
        FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;
      `);
    }
    const savedFkPost = await client.query(`
      SELECT constraint_name FROM information_schema.table_constraints
      WHERE table_name = 'saved_posts' AND constraint_name = 'saved_posts_post_id_posts_id_fk';
    `);
    if (savedFkPost.rows.length === 0) {
      await client.query(`
        ALTER TABLE "saved_posts" ADD CONSTRAINT "saved_posts_post_id_posts_id_fk"
        FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade;
      `);
    }
    console.log('   OK');

    console.log('\nSemua migration berhasil dijalankan!');
  } catch (error) {
    console.error('Error pada migration:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations();
