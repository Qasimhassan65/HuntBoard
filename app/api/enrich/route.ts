import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { input, type } = await req.json();

    if (!input) {
      return NextResponse.json({ error: 'Input is required' }, { status: 400 });
    }

    let contentToAnalyze = input;

    // Check if input is a URL and try to fetch its contents
    if (input.trim().startsWith('http://') || input.trim().startsWith('https://')) {
      try {
        const jinaUrl = `https://r.jina.ai/${input.trim()}`;
        const fetchRes = await fetch(jinaUrl, {
          headers: {
            'Accept': 'text/plain'
          }
        });
        if (fetchRes.ok) {
          const markdown = await fetchRes.text();
          contentToAnalyze = `URL: ${input}\n\nExtracted Webpage Content:\n${markdown.substring(0, 10000)}`;
        }
      } catch (err) {
        console.error("Could not fetch URL via Jina Reader, using raw input fallback", err);
      }
    }

    let prompt = '';
    
    if (type === 'job') {
      prompt = `Extract the following job information from this input: "${contentToAnalyze}". 
      Return ONLY a JSON object with no markdown formatting or other text.
      The JSON object should have these exact keys:
      - companyName (string)
      - companySize (string, e.g. "10-50", or null)
      - industry (string, e.g. "SaaS", or null)
      - techStack (array of strings, e.g. ["React", "Node.js"])
      - country (string, e.g. "Germany", or null)
      - remotePolicy (string: "fully-remote", "hybrid", "on-site", or null)
      - jobTitle (string)
      - salaryRange (string, e.g. "€50k-€70k", or null)
      - source (string, e.g. "LinkedIn", inferred from URL or text)
      `;
    } else if (type === 'contact') {
      prompt = `Extract the following contact information from this input: "${contentToAnalyze}".
      Return ONLY a JSON object with no markdown formatting or other text.
      The JSON object should have these exact keys:
      - name (string)
      - title (string)
      - company (string)
      - country (string, or null)
      - linkedInUrl (string, or null)
      `;
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful data extraction assistant. You only output pure, valid JSON."
        },
        {
          role: "user",
          content: prompt,
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      max_completion_tokens: 1024,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      throw new Error("No response from Groq");
    }

    const data = JSON.parse(responseContent);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Enrichment error:", error);
    return NextResponse.json(
      { error: 'Failed to enrich data' },
      { status: 500 }
    );
  }
}
