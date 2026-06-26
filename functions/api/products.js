export async function onRequestGet(context) {
  const { results } = await context.env.DB.prepare("SELECT * FROM products").all();
  return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestPost(context) {
  const product = await context.request.json();
  const id = product.id || Date.now().toString();
  await context.env.DB.prepare(
    "INSERT INTO products (id, name, badge, image, rating, price, originalPrice, collectionId) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)"
  ).bind(id, product.name, product.badge, product.image, product.rating, product.price, product.originalPrice, product.collectionId).run();
  
  return new Response(JSON.stringify({ success: true, id }), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestPut(context) {
  const product = await context.request.json();
  await context.env.DB.prepare(
    "UPDATE products SET name = ?1, badge = ?2, image = ?3, rating = ?4, price = ?5, originalPrice = ?6, collectionId = ?7 WHERE id = ?8"
  ).bind(product.name, product.badge, product.image, product.rating, product.price, product.originalPrice, product.collectionId, product.id).run();
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
}

export async function onRequestDelete(context) {
  const url = new URL(context.request.url);
  const id = url.searchParams.get("id");
  await context.env.DB.prepare("DELETE FROM products WHERE id = ?1").bind(id).run();
  
  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
}
