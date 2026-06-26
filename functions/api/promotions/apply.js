import { withAuth } from '../../auth';

export const onRequestPost = withAuth(async (context) => {
  const { request, env, data: { tenantId } } = context;
  
  try {
    const { promoCode } = await request.json();

    // Attempt to atomically increment current_uses ONLY if valid
    const updateQuery = `
      UPDATE promotions 
      SET current_uses = current_uses + 1
      WHERE tenant_id = ? 
        AND code = ?
        AND is_active = 1
        AND (max_uses IS NULL OR current_uses < max_uses)
        AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
      RETURNING id, value_cents, type;
    `;
    
    const { results, success } = await env.DB.prepare(updateQuery)
      .bind(tenantId, promoCode)
      .all();

    if (!success || results.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid, expired, or fully claimed promo code" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true, promo: results[0] }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
