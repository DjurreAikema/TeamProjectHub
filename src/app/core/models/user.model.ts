export interface UserModel {
  id: string;
  email: string;
  name: string;
  avatar: string;
  role: 'admin' | 'pm' | 'developer' | 'viewer';
  createdAt: string;
  lastActive: string;
}
