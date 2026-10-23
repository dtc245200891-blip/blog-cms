import { Router } from 'express';
import { PostsController } from './posts.controller';
import { authenticate, optionalAuthenticate } from '../../middlewares/auth.middleware';
import { authorizeRoles, ROLES } from '../../middlewares/rbac.middleware';

const router = Router();

// Public routes
router.get('/', PostsController.getPublicPosts);
router.get('/detail/:slug', optionalAuthenticate, PostsController.getPostBySlug);

// Bookmark routes
router.get('/bookmarks/my-bookmarks', authenticate, PostsController.getBookmarks);
router.post('/:id/bookmark', authenticate, PostsController.toggleBookmark);

// Management routes (Author, Editor, Admin)
router.get('/manage', authenticate, authorizeRoles(ROLES.AUTHOR, ROLES.EDITOR, ROLES.ADMIN), PostsController.getManagePosts);
router.post('/', authenticate, authorizeRoles(ROLES.AUTHOR, ROLES.EDITOR, ROLES.ADMIN), PostsController.createPost);
router.patch('/:id', authenticate, authorizeRoles(ROLES.AUTHOR, ROLES.EDITOR, ROLES.ADMIN), PostsController.updatePost);
router.delete('/:id', authenticate, authorizeRoles(ROLES.AUTHOR, ROLES.EDITOR, ROLES.ADMIN), PostsController.deletePost);

// Workflow state transitions
router.post('/:id/submit', authenticate, authorizeRoles(ROLES.AUTHOR, ROLES.EDITOR, ROLES.ADMIN), PostsController.submitForReview);
router.post('/:id/approve', authenticate, authorizeRoles(ROLES.EDITOR, ROLES.ADMIN), PostsController.approvePost);
router.post('/:id/reject', authenticate, authorizeRoles(ROLES.EDITOR, ROLES.ADMIN), PostsController.rejectPost);
router.post('/:id/publish', authenticate, authorizeRoles(ROLES.EDITOR, ROLES.ADMIN), PostsController.publishPost);
router.post('/:id/archive', authenticate, authorizeRoles(ROLES.AUTHOR, ROLES.EDITOR, ROLES.ADMIN), PostsController.archivePost);

export default router;
