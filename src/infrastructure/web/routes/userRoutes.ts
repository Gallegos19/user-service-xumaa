import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { TutorRelationshipController } from '../controllers/TutorRelationshipController';
import { UserRestrictionsController } from '../controllers/UserRestrictionsController';
import { authMiddleware } from '../middleware/authMiddleware';

export function createUserRoutes(userController: UserController, tutorRelationshipController: TutorRelationshipController, userRestrictionsController: UserRestrictionsController): Router {
  const router = Router();
  router.use(authMiddleware); // Proteger todas las rutas
  router.get('/profile/:userId', (req, res) => userController.getProfile(req, res));
  router.put('/profile/:userId', (req, res) => userController.updateProfile(req, res));
  router.post('/avatar/:userId', (req, res) => userController.updateAvatar(req, res));
  router.get('/preferences/:userId', (req, res) => userController.getPreferences(req, res));
  router.put('/preferences/:userId', (req, res) => userController.updatePreferences(req, res));
  // TutorRelationship
  router.post('/tutor-relationship', (req, res) => tutorRelationshipController.create(req, res));
  router.put('/tutor-relationship/:relationshipId/approve', (req, res) => tutorRelationshipController.approve(req, res));
  router.get('/tutor-relationship/:userId', (req, res) => tutorRelationshipController.getByUser(req, res));
  // UserRestrictions
  router.get('/restrictions/:userId', (req, res) => userRestrictionsController.getRestrictions(req, res));
  return router;
} 