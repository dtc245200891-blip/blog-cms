export type UserRole = 'ADMIN' | 'EDITOR' | 'AUTHOR' | 'READER';

export type PostStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'REJECTED' | 'SCHEDULED' | 'ARCHIVED';

export type CommentStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SPAM';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  _count?: {
    posts: number;
    comments: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  children?: Category[];
  _count?: {
    posts: number;
  };
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  _count?: {
    postTags: number;
  };
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  featuredImage?: string | null;
  status: PostStatus;
  rejectionReason?: string | null;
  isPinned: boolean;
  allowComments: boolean;
  viewsCount: number;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    fullName: string;
    username: string;
    avatarUrl?: string | null;
    bio?: string | null;
  };
  categoryId?: string | null;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags?: Tag[];
  isBookmarked?: boolean;
  relatedPosts?: Array<{
    id: string;
    title: string;
    slug: string;
    featuredImage?: string | null;
    publishedAt?: string | null;
    author: { fullName: string; avatarUrl?: string | null };
  }>;
  _count?: {
    comments: number;
    bookmarks: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
  postId: string;
  post?: {
    id: string;
    title: string;
    slug: string;
  };
  authorId: string;
  author: {
    id: string;
    fullName: string;
    username: string;
    avatarUrl?: string | null;
    role: UserRole;
  };
  parentId?: string | null;
  replies?: Comment[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'DANGER';
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
  uploader?: {
    id: string;
    fullName: string;
    username: string;
  };
}

export interface AuditLogItem {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  user?: {
    id: string;
    fullName: string;
    username: string;
    role: string;
  } | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
  errors?: any;
}
