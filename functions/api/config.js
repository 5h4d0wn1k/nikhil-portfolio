export async function onRequestGet(context) {
  const { env } = context;
  const db = env.PORTFOLIO_DB;
  if (!db) {
    return new Response(JSON.stringify({ error: 'Database not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  try {
    const { results } = await db.prepare('SELECT key, value FROM config').all();
    const config = {};
    for (const row of results) {
      try { config[row.key] = JSON.parse(row.value); } catch { config[row.key] = row.value; }
    }
    return new Response(JSON.stringify(config), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=300', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
