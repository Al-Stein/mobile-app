import { type Driver } from '@/types/driver';

// Mock user data for development
const mockDriver: Driver = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+33612345678',
  address: '123 Rue de Paris',
  city: 'Paris',
  postalCode: '75001',
  licenseNumber: 'VTC123456',
  vehicleModel: 'Mercedes Classe S',
  vehiclePlate: 'AB-123-CD',
  rating: 4.92,
  totalTrips: 1234,
  experienceYears: 2,
  experienceMonths: 3,
  profileImage: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&q=80',
  status: 'active',
  accountType: 'premium',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function GET(request: Request) {
  try {
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers, status: 204 });
    }

    // In a real app, you would:
    // 1. Validate the Authorization token
    // 2. Fetch the user profile from a database
    // For now, we'll return mock data

    return new Response(
      JSON.stringify({
        data: mockDriver
      }),
      { headers }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error' 
      }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}