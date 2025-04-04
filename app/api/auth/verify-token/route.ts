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

    // Get the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'No token provided' }), 
        { status: 401, headers }
      );
    }

    const token = authHeader.split(' ')[1];
    
    // In a real app, you would:
    // 1. Verify the JWT token signature
    // 2. Check if the token is expired
    // 3. Validate against your database
    
    // For development, we'll just check if it's our mock token
    if (token.startsWith('mock_token_')) {
      return new Response(
        JSON.stringify({ valid: true }),
        { headers }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Invalid token' }), 
      { status: 401, headers }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}