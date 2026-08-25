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
    const { results } = await db.prepare('SELECT * FROM projects ORDER BY id ASC').all();
    
    const projects = results.map(p => ({
      ...p,
      tech: JSON.parse(p.tech || '[]'),
      highlights: JSON.parse(p.highlights || '[]'),
      links: JSON.parse(p.links || '[]'),
      proof: JSON.parse(p.proof || '[]'),
    }));

    return new Response(JSON.stringify(projects), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
