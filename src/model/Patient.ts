import { BaseEntity } from './BaseEntity';

export class Patient extends BaseEntity {
  name: string;
  phone: string;
  dateOfBirth: Date;
  address: string;

  constructor(data: Partial<Patient>) {
    super(data.id || '');
    this.name = data.name || '';
    this.phone = data.phone || '';
    this.dateOfBirth = data.dateOfBirth || new Date();
    this.address = data.address || '';
  }
} 