export interface UserAvatarCommandPort {
  updateUserAvatar(userId: string, avatarUrl: string): Promise<{ avatarUrl: string } | null>;
} 