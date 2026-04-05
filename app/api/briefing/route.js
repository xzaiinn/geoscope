export async function POST(request) {
    const { country, module } = await request.json();

    const prompts = {
        overview: `Give a concise geopolitical briefing on ${country} in 2026. Cover: current political system & leader, major domestic issues, international positioning, and 2-3 key things someone studying IR should know. Be direct and analytical. 200 words max.`,
        history: `Give a concise historical context briefing for ${country} focused on what shaped its current geopolitical position. Cover: key historical turning points, colonial/imperial legacy if relevant, how history shapes current foreign policy. Be analytical. 200 words max.`,
        economy: `Give a concise economic briefing on ${country} in 2026. Cover: GDP ranking, key industries, trade dependencies, economic vulnerabilities, and how economics drives its geopolitical behavior. Be analytical. 200 words max.`,
        military: `Give a concise military/security briefing on ${country} in 2026. Cover: military capabilities, nuclear status, key security threats, defense spending context, and major military alliances or operations. Be analytical. 200 words max.`,
        alliances: `Give a concise alliance and diplomatic briefing on ${country} in 2026. Cover: major alliance memberships, key bilateral relationships, diplomatic strategy, and current diplomatic tensions or initiatives. Be analytical. 200 words max.`,
    };

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.ANTHROPIC_API_KEY,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                messages: [
                    { role: 'user', content: prompts[module] || prompts.overview },
                ],
            }),
        });

        const data = await response.json();
        const text = data.content
            ?.map((item) => (item.type === 'text' ? item.text : ''))
            .filter(Boolean)
            .join('\n');

        return Response.json({ briefing: text });
    } catch (error) {
        return Response.json({ briefing: 'Error generating briefing. Check your API key.' }, { status: 500 });
    }
}