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
        // Step 1: Fetch headlines from MediaStack
        const newsRes = await fetch(
            `http://api.mediastack.com/v1/news?access_key=${process.env.MEDIASTACK_API_KEY}&languages=en&limit=20`
        );
        const newsData = await newsRes.json();
        console.log('MediaStack response:', JSON.stringify(newsData).slice(0, 500));

        if (!newsData.data || newsData.data.length === 0) {
            return Response.json({ events: [], error: 'No articles found' });
        }

        // Step 2: Send headlines to Claude to extract geopolitical events
        const headlines = newsData.data
            .filter((a) => a.title)
            .slice(0, 15)
            .map((a, i) => `${i + 1}. ${a.title} — ${a.source || 'Unknown'}`)
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

        // Call Claude with retry for overloaded errors
        let claudeData = null;
        for (let attempt = 0; attempt < 3; attempt++) {
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

            claudeData = await claudeRes.json();

            // If overloaded, wait and retry
            if (claudeData?.error?.type === 'overloaded_error') {
                console.log(`Claude overloaded, retry ${attempt + 1}/3...`);
                await new Promise((r) => setTimeout(r, 2000));
                continue;
            }
            break;
        }

        // Check if we got a valid response
        if (!claudeData?.content) {
            console.error('Claude error:', claudeData?.error);
            return Response.json({ events: [], error: 'AI service temporarily unavailable. Try again.' });
        }

        const rawText = claudeData.content
            .map((item) => (item.type === 'text' ? item.text : ''))
            .filter(Boolean)
            .join('');

        let events = [];
        try {
            const cleaned = rawText.replace(/```json|```/g, '').trim();
            events = JSON.parse(cleaned);
        } catch (parseErr) {
            console.error('Failed to parse Claude response:', rawText?.slice(0, 300));
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