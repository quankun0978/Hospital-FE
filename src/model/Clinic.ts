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
  logoImg?: string;
  isHospital?: boolean;
  clinicImages?: ClinicImage[];
  doctors?: ClinicDoctor[];
}

export interface ClinicImage {
  id: number;
  imageFallbackUrl: string;
  isBackground: boolean;
  clinicId: string;
}

export interface ClinicDoctor {
  id: number;
  doctorId: string;
  doctorName: string;
  priceId: string;
  priceName: string;
  positionId: string;
  positionName: string;
  slug: string;
  note: string;
  imageUrl: string;
  count?: number;
} 