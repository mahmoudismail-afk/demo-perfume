import jwt from '@tsndr/cloudflare-worker-jwt';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { phone, password } = body;

    if (!phone || !password) {
      return new Response(JSON.stringify({ success: false, error: 'Phone and password are required' }), { status: 400 });
    }

    const tenantId = 'jamaludeen-perfumes'; // Default tenant
    const passwordHash = await hashPassword(password);

    const customer = await context.env.DB.prepare(
      'SELECT id, first_name, last_name, phone FROM customers WHERE tenant_id = ? AND phone = ? AND password_hash = ?'
    ).bind(tenantId, phone, passwordHash).first();

    if (!customer) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid phone number or password' }), { status: 401 });
    }

    // Create JWT
    const token = await jwt.sign(
      { 
        id: customer.id,
        phone: customer.phone,
        role: 'customer',
        exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60) // 30 days
      }, 
      context.env.JWT_SECRET
    );

    return new Response(JSON.stringify({ success: true, token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Login failed', details: error.message }), { status: 500 });
  }
}
