import { BaseEntity } from './BaseEntity';

export class User extends BaseEntity {
  username: string;
  email: string;
  phone: string;
  role: string;

  constructor(data: Partial<User>) {
    super(data.id || '');
    this.username = data.username || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.role = data.role || '';
  }
} 