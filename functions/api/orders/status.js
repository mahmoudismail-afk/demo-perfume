import { withAuth } from '../../auth';

export const onRequestPut = withAuth(async (context) => {
  const { request, env, data: { tenantId } } = context;
  
  try {
    const { orderId, status } = await request.json();
    
    // Status must be one of the ENUM values mocked in CHECK constraints
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Canceled'];
    if (!validStatuses.includes(status)) {
      return new Response(JSON.stringify({ error: "Invalid order status" }), { status: 400 });
    }

    const query = `
      UPDATE orders 
      SET status = ? 
      WHERE id = ? AND tenant_id = ?
    `;
    
    const { success } = await env.DB.prepare(query)
      .bind(status, orderId, tenantId)
      .run();
      
    if (!success) {
      return new Response(JSON.stringify({ error: "Order not found or update failed" }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
