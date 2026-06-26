import jwt from '@tsndr/cloudflare-worker-jwt';

export async function onRequestGet(context) {
  try {
    const authHeader = context.request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const isValid = await jwt.verify(token, context.env.JWT_SECRET);
    if (!isValid) {
      return new Response(JSON.stringify({ success: false, error: 'Invalid token' }), { status: 401 });
    }

    const { payload } = jwt.decode(token);
    if (payload.role !== 'customer') {
      return new Response(JSON.stringify({ success: false, error: 'Not a customer' }), { status: 403 });
    }

    const customer = await context.env.DB.prepare(
      'SELECT id, first_name, last_name, phone FROM customers WHERE id = ?'
    ).bind(payload.id).first();

    if (!customer) {
      return new Response(JSON.stringify({ success: false, error: 'Customer not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, customer }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch profile', details: error.message }), { status: 500 });
  }
}
