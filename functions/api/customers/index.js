import { withAuth } from '../../auth';

export const onRequestGet = withAuth(async (context) => {
  const { env, data: { tenantId } } = context;

  // We query the customer_lifetime_value View we created in SQLite
  // We sort by lifetime value to show top spenders first
  const query = `
    SELECT 
      c.id as customer_id,
      c.first_name,
      c.last_name,
      c.email,
      c.phone,
      COUNT(o.id) as total_orders,
      COALESCE(SUM(o.total_amount_cents - o.discount_amount_cents), 0) as lifetime_value_cents
    FROM customers c
    LEFT JOIN orders o ON c.id = o.customer_id AND o.status != 'Canceled'
    WHERE c.tenant_id = ?
    GROUP BY c.id
    ORDER BY lifetime_value_cents DESC
  `;
  
  try {
    const { results } = await env.DB.prepare(query)
      .bind(tenantId)
      .all();
      
    return new Response(JSON.stringify({ data: results }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
