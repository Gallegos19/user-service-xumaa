import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { UserQueryPort } from '../../../application/ports/input/UserQueryPort';
import { UserCommandPort } from '../../../application/ports/input/UserCommandPort';
import { UserAvatarCommandPort } from '../../../application/ports/input/UserAvatarCommandPort';
import { UserPreferencesQueryPort } from '../../../application/ports/input/UserPreferencesQueryPort';
import { UserPreferencesCommandPort } from '../../../application/ports/input/UserPreferencesCommandPort';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// @ts-nocheck

@injectable()
export class UserController {
  constructor(
    @inject('UserQueryPort') private readonly userQueryPort: UserQueryPort,
    @inject('UserCommandPort') private readonly userCommandPort: UserCommandPort,
    @inject('UserAvatarCommandPort') private readonly userAvatarCommandPort: UserAvatarCommandPort,
    @inject('UserPreferencesQueryPort') private readonly userPreferencesQueryPort: UserPreferencesQueryPort,
    @inject('UserPreferencesCommandPort') private readonly userPreferencesCommandPort: UserPreferencesCommandPort

  ) {}

  /**
   * @swagger
   * /api/users/profile/{userId}:
   *   get:
   *     summary: Obtener perfil de usuario
   *     description: Obtiene el perfil público de un usuario por su ID.
   *     tags:
   *       - Usuarios
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del usuario
   *     responses:
   *       200:
   *         description: Perfil de usuario encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                     email:
   *                       type: string
   *                       format: email
   *                     firstName:
   *                       type: string
   *                     lastName:
   *                       type: string
   *                     age:
   *                       type: integer
   *                     isVerified:
   *                       type: boolean
   *                     accountStatus:
   *                       type: string
   *                       enum: [pending_verification, active, suspended, deactivated]
   *                     createdAt:
   *                       type: string
   *                       format: date-time
   *       404:
   *         description: Usuario no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: Usuario no encontrado
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   */
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const user = await this.userQueryPort.getUserProfile(userId);
      if (!user) {
        res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        return;
      }
      res.status(200).json({ success: true, data: {
        id: user.getId().value,
        email: user.getEmail().value,
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        age: user.getAge().value,
        isVerified: user.getIsVerified(),
        accountStatus: user.getAccountStatus(),
        createdAt: user.getCreatedAt()
      }});
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * @swagger
   * /api/users/profile/{userId}:
   *   put:
   *     summary: Actualizar perfil de usuario
   *     description: Actualiza los datos del perfil de un usuario por su ID.
   *     tags:
   *       - Usuarios
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del usuario
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               age:
   *                 type: integer
   *           example:
   *             firstName: "Juan"
   *             lastName: "Pérez"
   *             age: 25
   *     responses:
   *       200:
   *         description: Perfil actualizado correctamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                     firstName:
   *                       type: string
   *                     lastName:
   *                       type: string
   *                     age:
   *                       type: integer
   *       404:
   *         description: Usuario no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: Usuario no encontrado
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   */
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const { firstName, lastName, age } = req.body;
      const user = await this.userCommandPort.updateUserProfile(userId, { firstName, lastName, age });
      if (!user) {
        res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        return;
      }
      res.status(200).json({ success: true, data: {
        id: user.getId().value,
        firstName: user.getFirstName(),
        lastName: user.getLastName(),
        age: user.getAge().value
      }});
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * @swagger
   * /api/users/avatar/{userId}:
   *   post:
   *     summary: Actualizar avatar de usuario
   *     description: Actualiza la URL del avatar de un usuario por su ID.
   *     tags:
   *       - Usuarios
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del usuario
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               avatarUrl:
   *                 type: string
   *                 format: uri
   *           example:
   *             avatarUrl: "https://cdn.ejemplo.com/avatars/usuario123.png"
   *     responses:
   *       200:
   *         description: Avatar actualizado correctamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     avatarUrl:
   *                       type: string
   *                       format: uri
   *       404:
   *         description: Usuario no encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: Usuario no encontrado
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   */
  async updateAvatar(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const { avatarUrl } = req.body;
      const result = await this.userAvatarCommandPort.updateUserAvatar(userId, avatarUrl);
      if (!result) {
        res.status(404).json({ success: false, error: 'Usuario no encontrado' });
        return;
      }
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * @swagger
   * /api/users/preferences/{userId}:
   *   get:
   *     summary: Obtener preferencias de usuario
   *     description: Obtiene las preferencias de un usuario por su ID.
   *     tags:
   *       - Usuarios
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del usuario
   *     responses:
   *       200:
   *         description: Preferencias encontradas
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     darkMode:
   *                       type: boolean
   *                     fontSize:
   *                       type: string
   *                     soundEnabled:
   *                       type: boolean
   *                     pushNotifications:
   *                       type: boolean
   *                     emailNotifications:
   *                       type: boolean
   *                     marketingEmails:
   *                       type: boolean
   *                     dataCollectionConsent:
   *                       type: boolean
   *                     accessibilityFeatures:
   *                       type: object
   *       404:
   *         description: Preferencias no encontradas
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: Preferencias no encontradas
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   */
  async getPreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const preferences = await this.userPreferencesQueryPort.getUserPreferences(userId);
      if (!preferences) {
        res.status(404).json({ success: false, error: 'Preferencias no encontradas' });
        return;
      }
      res.status(200).json({ success: true, data: {
        darkMode: preferences.getDarkMode(),
        fontSize: preferences.getFontSize(),
        soundEnabled: preferences.getSoundEnabled(),
        pushNotifications: preferences.getPushNotifications(),
        emailNotifications: preferences.getEmailNotifications(),
        marketingEmails: preferences.getMarketingEmails(),
        dataCollectionConsent: preferences.getDataCollectionConsent(),
        accessibilityFeatures: preferences.getAccessibilityFeatures()
      }});
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
  }

  /**
   * @swagger
   * /api/users/preferences/{userId}:
   *   put:
   *     summary: Actualizar preferencias de usuario
   *     description: Actualiza las preferencias de un usuario por su ID.
   *     tags:
   *       - Usuarios
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID del usuario
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               darkMode:
   *                 type: boolean
   *               fontSize:
   *                 type: string
   *               soundEnabled:
   *                 type: boolean
   *               pushNotifications:
   *                 type: boolean
   *               emailNotifications:
   *                 type: boolean
   *               marketingEmails:
   *                 type: boolean
   *               dataCollectionConsent:
   *                 type: boolean
   *               accessibilityFeatures:
   *                 type: object
   *     responses:
   *       200:
   *         description: Preferencias actualizadas correctamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     darkMode:
   *                       type: boolean
   *                     fontSize:
   *                       type: string
   *                     soundEnabled:
   *                       type: boolean
   *                     pushNotifications:
   *                       type: boolean
   *                     emailNotifications:
   *                       type: boolean
   *                     marketingEmails:
   *                       type: boolean
   *                     dataCollectionConsent:
   *                       type: boolean
   *                     accessibilityFeatures:
   *                       type: object
   *       404:
   *         description: Preferencias no encontradas
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   *                   example: Preferencias no encontradas
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 error:
   *                   type: string
   */
  async updatePreferences(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const preferencesData = req.body;
      const updated = await this.userPreferencesCommandPort.updateUserPreferences(userId, preferencesData);
      if (!updated) {
        res.status(404).json({ success: false, error: 'Preferencias no encontradas' });
        return;
      }
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
  }
}