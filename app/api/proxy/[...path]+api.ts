import { type NextRequest } from 'next/server';

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}

export async function PUT(request: NextRequest) {
  return handleRequest(request);
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request);
}

async function handleRequest(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/proxy/', '');
    const targetUrl = `https://carresa.com/api/${path}`;

    const headers = new Headers(request.headers);
    headers.delete('host');

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' ? await request.text() : undefined,
    });

    const responseHeaders = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  }
}