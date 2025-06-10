import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query parameter is required' });
  }
  
  try {
    // Clean the query
    const cleanQuery = query.split(',')[0].replace(/\s+\d+.*$/, '').replace(/\s+[(-].*$/, '').trim();
    
    // Get search results
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQuery)}&format=json&srlimit=1`;
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      return res.status(searchResponse.status).json({ error: `Wikipedia search API returned ${searchResponse.status}` });
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.query?.search?.length) {
      return res.status(404).json({ error: 'No Wikipedia page found' });
    }
    
    // Get page summary with image
    const pageTitle = searchData.query.search[0].title;
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
    const summaryResponse = await fetch(summaryUrl);
    
    if (!summaryResponse.ok) {
      return res.status(summaryResponse.status).json({ error: `Wikipedia summary API returned ${summaryResponse.status}` });
    }
    
    const data = await summaryResponse.json();
    
    if (data.thumbnail?.source) {
      // Get higher resolution image
      const betterImage = data.thumbnail.source.replace(/\/\d+px-/, '/800px-');
      
      return res.json({
        imageUrl: betterImage,
        title: data.title,
        extract: data.extract
      });
    }
    
    return res.status(404).json({ error: 'No image found for this article' });
  } catch (error) {
    console.error('Wikipedia proxy error:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
  }
}