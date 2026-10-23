import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { AdminLayout } from '../layouts/AdminLayout';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { PostsPage } from '../pages/public/PostsPage';
import { PostDetailPage } from '../pages/public/PostDetailPage';
import { CategoryPage } from '../pages/public/CategoryPage';
import { TagPage } from '../pages/public/TagPage';
import { SearchPage } from '../pages/public/SearchPage';
import { AuthorProfilePage } from '../pages/public/AuthorProfilePage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { ForgotPasswordPage } from '../pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/public/ResetPasswordPage';
import { UserProfilePage } from '../pages/public/UserProfilePage';
import { SavedPostsPage } from '../pages/public/SavedPostsPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminPostsPage } from '../pages/admin/AdminPostsPage';
import { AdminPostEditPage } from '../pages/admin/AdminPostEditPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminTagsPage } from '../pages/admin/AdminTagsPage';
import { AdminCommentsPage } from '../pages/admin/AdminCommentsPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminMediaPage } from '../pages/admin/AdminMediaPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';
import { AdminAuditLogsPage } from '../pages/admin/AdminAuditLogsPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="posts/:slug" element={<PostDetailPage />} />
        <Route path="categories" element={<PostsPage />} />
        <Route path="categories/:slug" element={<CategoryPage />} />
        <Route path="tags/:slug" element={<TagPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="authors/:id" element={<AuthorProfilePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="profile" element={<UserProfilePage />} />
        <Route path="saved-posts" element={<SavedPostsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* Admin Pages (Protected with AdminLayout) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="posts" element={<AdminPostsPage />} />
        <Route path="posts/new" element={<AdminPostEditPage />} />
        <Route path="posts/edit/:id" element={<AdminPostEditPage />} />
        <Route path="categories" element={<AdminCategoriesPage />} />
        <Route path="tags" element={<AdminTagsPage />} />
        <Route path="comments" element={<AdminCommentsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="media" element={<AdminMediaPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
        <Route path="audit-logs" element={<AdminAuditLogsPage />} />
      </Route>
    </Routes>
  );
};
