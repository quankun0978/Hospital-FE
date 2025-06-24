import { BaseEntity } from './BaseEntity';

export class User extends BaseEntity {
  username: string;
  email: string;
  phone: string;
  roleId: string;
  userId: string;
  name: string;
  constructor(data: Partial<User>) {
    super(data.id || '');
    this.username = data.username || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.roleId = data.roleId || '';
    this.userId = data.userId || '';
    this.name = data.name || '';
  } 
} 