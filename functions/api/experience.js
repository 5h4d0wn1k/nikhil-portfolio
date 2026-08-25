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
    const { results } = await db.prepare('SELECT * FROM work_experience ORDER BY id ASC').all();
    
    const experience = results.map(r => ({
      ...r,
      responsibilities: JSON.parse(r.responsibilities || '[]'),
      tech: JSON.parse(r.tech || '[]'),
      products: JSON.parse(r.products || '[]'),
    }));

    return new Response(JSON.stringify(experience), {
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
