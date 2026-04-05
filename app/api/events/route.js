import { getCached, setCache } from '../../../lib/cache';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') || 'world';
    const framework = searchParams.get('framework') || 'none';

    // Check cache first
    const cacheKey = `events-${framework}-${region}`;
    const cached = getCached(cacheKey);
    if (cached) {
        return Response.json({
            ...cached,
            fromCache: true,
        });
    }

    try {
        // Step 1: Fetch headlines from NewsAPI
        const newsRes = await fetch(
            `https://newsapi.org/v2/top-headlines?category=general&language=en&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`
        );
        const newsData = await newsRes.json();

        if (!newsData.articles || newsData.articles.length === 0) {
            return Response.json({ events: [], error: 'No articles found' });
        }

        // Step 2: Send headlines to Claude to extract geopolitical events
        const headlines = newsData.articles
            .filter((a) => a.title && a.title !== '[Removed]')
            .slice(0, 15)
            .map((a, i) => `${i + 1}. ${a.title} — ${a.source?.name || 'Unknown'}`)
            .join('\n');

        const frameworkInstructions = {
            none: 'Analyze objectively without any specific theoretical framework.',
            realist:
                'Analyze through a REALIST lens: focus on power dynamics, national interest, security competition, balance of power, and state survival. Emphasize how states maximize relative power.',
            liberal:
                'Analyze through a LIBERAL INSTITUTIONALIST lens: focus on international institutions, cooperation, economic interdependence, democratic peace theory, and multilateral solutions.',
            constructivist:
                'Analyze through a CONSTRUCTIVIST lens: focus on identity, norms, ideas, social construction of interests, how shared beliefs shape behavior, and how meaning is created in international relations.',
            marxist:
                'Analyze through a MARXIST/CRITICAL lens: focus on economic structures, class dynamics, center-periphery relations, exploitation, capital flows, and how economic power shapes political outcomes.',
        };

        const frameworkPrompt = frameworkInstructions[framework] || frameworkInstructions.none;

        const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 2000,
                messages: [
                    {
                        role: 'user',
                        content: `You are a geopolitical analyst. Extract geopolitical events from these headlines and return ONLY valid JSON, no other text.
 
${frameworkPrompt}
 
Headlines:
${headlines}
 
Return a JSON array of geopolitical events. Only include headlines that are genuinely about international relations, geopolitics, conflict, diplomacy, trade, or political developments. Skip sports, entertainment, celebrity news, and purely domestic stories with no geopolitical relevance.
 
Each event object must have:
- "title": short event title (max 10 words)
- "summary": 1-2 sentence analysis${framework !== 'none' ? ' through the ' + framework + ' framework' : ''}
- "countries": array of 2-letter country codes involved (e.g. ["US", "CN"])
- "severity": number 1-5 (1=routine, 3=significant, 5=crisis)
- "category": one of "conflict", "diplomacy", "trade", "politics", "security", "humanitarian"
- "source": the news source name
 
Return between 3-8 events. If fewer than 3 headlines are geopolitically relevant, return what you can.
Return ONLY the JSON array, no markdown, no code fences, no explanation.`,
                    },
                ],
            }),
        });

        const claudeData = await claudeRes.json();
        const rawText = claudeData.content
            ?.map((item) => (item.type === 'text' ? item.text : ''))
            .filter(Boolean)
            .join('');

        // Parse the JSON response
        let events = [];
        try {
            const cleaned = rawText.replace(/```json|```/g, '').trim();
            events = JSON.parse(cleaned);
        } catch (parseErr) {
            console.error('Failed to parse Claude response:', rawText);
            return Response.json({ events: [], error: 'Failed to parse events' });
        }

        const result = {
            events,
            framework: framework,
            lastUpdated: new Date().toISOString(),
        };

        // Cache for 30 minutes
        setCache(cacheKey, result, 30);

        return Response.json(result);
    } catch (error) {
        console.error('Events API error:', error);
        return Response.json({ events: [], error: 'Failed to fetch events' }, { status: 500 });
    }
}