export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  licenseNumber: string;
  vehicleModel: string;
  vehiclePlate: string;
  rating: number;
  totalTrips: number;
  experienceYears: number;
  experienceMonths: number;
  profileImage: string;
  status: 'active' | 'inactive' | 'suspended';
  accountType: 'standard' | 'premium';
  createdAt: string;
  updatedAt: string;
}

export interface DriverUpdateDto {
  address?: string;
  city?: string;
  postalCode?: string;
  vehicleModel?: string;
  vehiclePlate?: string;
}