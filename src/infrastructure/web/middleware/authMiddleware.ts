import { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization || req.headers.Authorization as string;
    
    // Verificar si el token existe
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token de autenticación requerido' 
      });
    }

    // Verificar el formato del token
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0].toLowerCase() !== 'bearer') {
      return res.status(401).json({ 
        success: false, 
        error: 'Formato de token inválido. Usa: Bearer <token>',
        received: authHeader
      });
    }

    const token = tokenParts[1];
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'Token no proporcionado' 
      });
    }
    
    // Aquí podrías validar el token JWT si lo deseas
    // Por ahora, solo lo adjuntamos al request para su uso posterior
    (req as any).token = token;
    
    next();
    return true;
  } catch (error) {
    console.error('Error en el middleware de autenticación:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor al procesar la autenticación' 
    });
  }
}