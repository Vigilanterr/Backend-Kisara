export interface Post {
  id: number;
  categoryId: number;
  title: string;
  content: string;
  image: string | null;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostWithCategory extends Post {
  categoryName: string | null;
}

export interface CreatePost {
  categoryId: number;
  title: string;
  content: string;
  image?: string | null;
  author?: string;
}

export interface UpdatePost {
  categoryId?: number;
  title?: string;
  content?: string;
  image?: string | null;
  author?: string;
}
