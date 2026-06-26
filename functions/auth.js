import jwt from '@tsndr/cloudflare-worker-jwt';

// Middleware to verify token signature and extract the tenant ID
export const withAuth = (handler) => async (context) => {
  const { request, env } = context;
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Missing or invalid token' }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 1. Verify the signature cryptographically
    // env.JWT_SECRET pulls securely from your Cloudflare secrets
    const isValid = await jwt.verify(token, env.JWT_SECRET);
    
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid token signature' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 2. Decode the payload safely now that verification passed
    const { payload } = jwt.decode(token);
    const tenantId = payload.org_id; // Ensure this matches your token's structure

    if (!tenantId) {
      return new Response(JSON.stringify({ error: 'Tenant context missing from token' }), { 
        status: 403,
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    // 3. Attach tenant context to the request for the downstream API handler
    // In Cloudflare Pages Functions, we attach to context.data
    context.data = { ...context.data, tenantId };
    return handler(context);

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Authentication failed', details: error.message }), { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
