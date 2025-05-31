import { BaseEntity } from './BaseEntity';

export class Doctor extends BaseEntity {
  name: string;
  specialty: string;
  description: string;
  avatar: string;

  constructor(data: Partial<Doctor>) {
    super(data.id || '');
    this.name = data.name || '';
    this.specialty = data.specialty || '';
    this.description = data.description || '';
    this.avatar = data.avatar || '';
  }
} 