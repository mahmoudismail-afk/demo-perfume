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
    const { firstName, lastName, phone, password } = body;

    if (!phone || !password) {
      return new Response(JSON.stringify({ success: false, error: 'Phone and password are required' }), { status: 400 });
    }

    const tenantId = 'jamaludeen-perfumes'; // Default tenant
    const customerId = Date.now().toString();
    const passwordHash = await hashPassword(password);

    // Check if phone exists
    const existing = await context.env.DB.prepare(
      'SELECT id FROM customers WHERE tenant_id = ? AND phone = ?'
    ).bind(tenantId, phone).first();

    if (existing) {
      return new Response(JSON.stringify({ success: false, error: 'Phone number already registered' }), { status: 409 });
    }

    // Insert new customer
    await context.env.DB.prepare(
      'INSERT INTO customers (id, tenant_id, first_name, last_name, phone, password_hash) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(customerId, tenantId, firstName || '', lastName || '', phone, passwordHash).run();

    // Create JWT
    const token = await jwt.sign(
      { 
        id: customerId,
        phone: phone,
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
    return new Response(JSON.stringify({ success: false, error: 'Signup failed', details: error.message }), { status: 500 });
  }
}
