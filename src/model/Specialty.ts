import { BaseEntity } from './BaseEntity';

export interface Specialty extends BaseEntity {
  specialtyId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  image?: string; // fallback
  slug?: string;
  link?: string;
} 