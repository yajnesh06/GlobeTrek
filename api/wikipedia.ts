import type { VercelRequest, VercelResponse } from '@vercel/node';

// Export as a default function
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Get the query parameter
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  try {
    // Clean the query - extract just the main attraction name
    const cleanQuery = query
      .split(',')[0]
      .replace(/\s+\d+.*$/, '')
      .replace(/\s+[(-].*$/, '')
      .trim();
    
    // First try a search to get the proper page title
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQuery)}&format=json&srlimit=1`;
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      return res.status(502).json({ error: 'Wikipedia search failed' });
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.query?.search?.length) {
      return res.status(404).json({ error: 'No Wikipedia page found' });
    }
    
    // Get the summary with thumbnail
    const pageTitle = searchData.query.search[0].title;
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
    const summaryResponse = await fetch(summaryUrl);
    
    if (!summaryResponse.ok) {
      return res.status(502).json({ error: 'Wikipedia summary failed' });
    }
    
    const data = await summaryResponse.json();
    
    if (data.thumbnail?.source) {
      const imageUrl = data.thumbnail.source.replace(/\/\d+px-/, '/800px-');

      return res.status(200).json({
        imageUrl,
        title: data.title,
        extract: data.extract
      });
    }
    
    return res.status(404).json({ error: 'No image found' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}