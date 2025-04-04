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

// Valid credentials for development
const VALID_CREDENTIALS = {
  email: 'john.doe@example.com',
  password: '123456789'
};

export async function POST(request: Request) {
  try {
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Content-Type': 'application/json',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers, status: 204 });
    }

    // Parse request body
    const body = await request.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return new Response(
        JSON.stringify({ 
          error: 'Email et mot de passe requis',
          success: false
        }), 
        { 
          status: 400,
          headers 
        }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ 
          error: 'Format d\'email invalide',
          success: false
        }), 
        { 
          status: 400,
          headers 
        }
      );
    }

    // Password validation
    if (password.length < 8) {
      return new Response(
        JSON.stringify({ 
          error: 'Le mot de passe doit contenir au moins 8 caractères',
          success: false
        }), 
        { 
          status: 400,
          headers 
        }
      );
    }

    // Check credentials
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
      // Generate a mock token (in production, use a proper JWT)
      const token = 'mock_token_' + Date.now();

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            token,
            user: mockDriver
          }
        }),
        { headers }
      );
    }

    // Driver not registered
    return new Response(
      JSON.stringify({ 
        error: 'Chauffeur non enregistré',
        success: false
      }), 
      { 
        status: 401,
        headers 
      }
    );

  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur interne du serveur',
        success: false
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