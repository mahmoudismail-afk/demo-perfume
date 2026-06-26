import { withAuth } from '../../auth';

export const onRequestGet = withAuth(async (context) => {
  const { env, data: { tenantId } } = context;
  const query = `
    SELECT pv.sku, pv.size, pv.stock_level, pv.low_stock_threshold, p.name 
    FROM product_variants pv
    JOIN products p ON p.id = pv.product_id
    WHERE pv.tenant_id = ? AND pv.stock_level <= pv.low_stock_threshold
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
