const PERPLEXITY_API_KEY = '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';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ConversationContext {
  previousQuery?: string;
  selectedTopic?: string;
  suggestedArticles: Set<string>;
  conversationMode: 'casual' | 'research';
  messageHistory: ChatMessage[];
}

let conversationContext: ConversationContext = {
  previousQuery: '',
  selectedTopic: '',
  suggestedArticles: new Set(),
  conversationMode: 'casual',
  messageHistory: []
};

const systemMessage = {
  role: 'system',
  content: `You are a direct-response UK-based assistant. Give clean, direct answers without citations.

CRITICAL RESPONSE RULES:
- NEVER create fictional articles or URLs
- ONLY provide real articles with actual URLs
- NEVER use citations, references, or source markers
- NEVER use [1], [2], [3] or any other bracketed numbers
- NEVER use Fahrenheit, only Celsius
- If no relevant articles are found, say "I couldn't find any relevant articles about this topic."

FOR CASUAL QUESTIONS:
1. Use these exact formats:
   Weather: "It's {temperature}°C and {condition} in {location} today."
   Weather follow-up: "Yes, bring an umbrella" or "No umbrella needed"
   Distance: "{X} miles by road."
   General: One direct statement.

FORMAT RULES:
- Use British English
- Temperature in Celsius ONLY
- Distances in miles
- UK date format (DD/MM/YYYY)
- 24-hour clock
- NHS terminology

RESEARCH MODE FORMAT:
For articles, use EXACTLY this format:
Here's what I found about [topic]:
- 'TITLE' (URL)
  ✓ Brief factual description 'DD/MM/YY'
- 'TITLE' (URL)
  ✓ Brief factual description 'DD/MM/YY'
- 'TITLE' (URL)
  ✓ Brief factual description 'DD/MM/YY'

If you can't find 3 articles with valid URLs, provide fewer articles but ensure each has a real URL.
Never make up articles or URLs.

These articles cover: [one-line summary]`
};

async function sendChatMessage(message: string): Promise<string> {
  try {
    const researchTriggers = [
      'find articles',
      'search for',
      'research',
      'articles about',
      'information on',
      'give me articles'
    ];
    
    const isResearchMode = researchTriggers.some(trigger => 
      message.toLowerCase().includes(trigger)
    ) || conversationContext.conversationMode === 'research';

    const isFollowUpQuery = message.toLowerCase().includes('different articles') || 
                           message.toLowerCase().includes('same topic');

    // Get recent conversation including both user and assistant messages
    const recentMessages = conversationContext.messageHistory
      .slice(-4) // Get last 2 exchanges (4 messages: 2 user + 2 assistant)
      .map(msg => `${msg.role}: "${msg.content}"`)
      .join('\n');

    // Find the last assistant message specifically
    const lastAssistantMessage = [...conversationContext.messageHistory]
      .reverse()
      .find(msg => msg.role === 'assistant');

    // Get topic from last assistant response if requesting articles about "this"
    let searchTopic = message;
    if (isResearchMode && 
        (message.toLowerCase().includes('this topic') || 
         message.toLowerCase().includes('about this'))) {
      if (lastAssistantMessage) {
        searchTopic = lastAssistantMessage.content;
      }
    }

    let userPrompt: string;
    if (isResearchMode) {
      userPrompt = `Recent conversation:
${recentMessages}

Current request: ${message}

Based on the conversation above, search for relevant UK healthcare articles about: "${searchTopic}".
Focus specifically on the topic discussed in the previous messages.

CRITICAL:
- Only include articles if you have a valid URL
- Do not make up or fabricate articles
- If you can't find relevant articles with URLs, say so
- Better to provide fewer articles with real URLs than fake ones

Present them in this format:
Here's what I found about [topic]:
- 'TITLE' (URL)
  ✓ Description 'DD/MM/YY'`;
    } else {
      // Modified to enforce stricter formatting
      const isWeatherQuery = message.toLowerCase().includes('weather');
      const isUmbrellaQuery = message.toLowerCase().includes('umbrella');
      
      let formatInstructions = isWeatherQuery 
        ? 'Respond EXACTLY in this format: "It\'s X°C and [condition] in [location] today."'
        : isUmbrellaQuery
        ? 'Respond EXACTLY in this format: "Yes, bring an umbrella." or "No umbrella needed."'
        : 'Provide ONE direct statement without citations or references.';

      userPrompt = `Recent conversation:
${recentMessages}

Current question: ${message}

${formatInstructions}

FORBIDDEN:
- Citations [1], [2], etc.
- Temperature in Fahrenheit
- Multiple sentences
- Words like "around" or "approximately"
- Source references
- Brackets of any kind
- Explanations`;
    }

    // Update conversation context
    if (!isFollowUpQuery && isResearchMode) {
      conversationContext = {
        previousQuery: message,
        selectedTopic: message,
        suggestedArticles: new Set(),
        conversationMode: 'research',
        messageHistory: conversationContext.messageHistory
      };
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          systemMessage,
          { role: 'user', content: userPrompt }
        ],
        temperature: isResearchMode ? 0.7 : 0.2
      })
    });

    console.log('API Response Status:', response.status);
    const responseData = await response.json();
    console.log('API Response Data:', responseData);

    if (!response.ok) {
      throw new Error(responseData.error?.message || 'Failed to get response from Perplexity AI');
    }
    
    if (!responseData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from API');
    }

    let content = responseData.choices[0].message.content;

    // Post-process to remove any citations that might have slipped through
    if (!isResearchMode && content) {
      content = content
        .replace(/\[\d+\]/g, '') // Remove citation numbers
        .replace(/\[.*?\]/g, '') // Remove any bracketed content
        .replace(/\(\d+°[FC]\)/g, '') // Remove temperature conversions
        .replace(/around|approximately|about/g, '') // Remove approximation words
        .replace(/\s+/g, ' ') // Clean up extra spaces
        .trim();
    }

    // Update message history
    conversationContext.messageHistory.push(
      { role: 'user', content: message, timestamp: new Date() },
      { role: 'assistant', content, timestamp: new Date() }
    );

    // Keep history at a reasonable size (last 10 messages = 5 exchanges)
    if (conversationContext.messageHistory.length > 10) {
      conversationContext.messageHistory = conversationContext.messageHistory.slice(-10);
    }

    // Extract and store suggested articles from the response if in research mode
    if (isResearchMode) {
      const articleTitles = content.match(/'([^']+)'/g)?.map(title => title.replace(/'/g, '')) || [];
      conversationContext.suggestedArticles = new Set([
        ...Array.from(conversationContext.suggestedArticles),
        ...articleTitles
      ]);
    }
    
    return content;
  } catch (error) {
    console.error('Perplexity API Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    });
    throw error;
  }
}

export { sendChatMessage, type ChatMessage };