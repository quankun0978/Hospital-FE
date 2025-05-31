export interface Clinic {
  clinicId: string;
  name: string;
  address: string;
  description?: string;
  imageUrl?: string;
  phone?: string;
  email?: string;
  openTime?: string;
  closeTime?: string;
  latitude?: number;
  longitude?: number;
  slug?: string;
} 