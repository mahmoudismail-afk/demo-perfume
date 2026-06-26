import jwt from '@tsndr/cloudflare-worker-jwt';

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { username, password } = body;
    
    // Check credentials against environment variables
    const validUsername = context.env.ADMIN_USERNAME;
    const validPassword = context.env.ADMIN_PASSWORD;

    if (!validUsername || !validPassword) {
      return new Response(JSON.stringify({ error: 'Server misconfiguration: Admin credentials not set' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (username === validUsername && password === validPassword) {
      // Create JWT token using the secret from env
      const token = await jwt.sign(
        { 
          username: username,
          role: 'admin',
          exp: Math.floor(Date.now() / 1000) + (24 * (60 * 60)) // 24 hours
        }, 
        context.env.JWT_SECRET
      );

      return new Response(JSON.stringify({ success: true, token }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Authentication failed', details: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
