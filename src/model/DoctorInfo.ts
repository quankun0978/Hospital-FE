export interface DoctorInfo {
  id: number;
  doctorId: string;
  priceId: string;
  priceName: string;
  positionId: string;
  positionName: string;
  clinicId?: string;
  clinicName: string;
  slug: string;
  note: string;
  imageUrl: string;
  count?: number;
} 