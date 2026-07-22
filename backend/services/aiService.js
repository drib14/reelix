import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: process.env.GROQ_BASE_URL,
});

const conversations = new Map();

export const askMovieAI = async (sessionId, message) => {
  try {
    if (!conversations.has(sessionId)) {
      conversations.set(sessionId, []);
    }

    const history = conversations.get(sessionId);

    history.push({
      role: "user",
      content: message,
    });

    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }

    const completion = await client.chat.completions.create({
      model: process.env.GROQ_MODEL,

      response_format: {
        type: "json_object",
      },

      temperature: 0.7,
      max_tokens: 800,

      messages: [
        {
          role: "system",
          content: `
You are MovieFlix AI.

You remember previous messages.

Understand filters naturally.

Examples:

Recommend action movies

Recommend action movies after 2018

Recommend comedy movies under 2 hours

Recommend horror movies rated above 8

Recommend sci-fi from the 90s

Recommend Christopher Nolan movies

Recommend Marvel movies

Recommend family movies for kids

Recommend anime after 2020

Recommend thriller movies longer than 150 minutes

If the request is asking for recommendations return ONLY:

{
  "type":"recommendation",
  "message":"Short friendly explanation.",
  "filters":{
      "genre":"",
      "year":"",
      "rating":"",
      "runtime":"",
      "director":"",
      "franchise":""
  },
  "movies":[
    {
      "title":"Movie Name",
      "year":2022
    }
  ]
}

For every other movie question return:

{
  "type":"chat",
  "message":"Your answer."
}

Always return valid JSON.
Never return markdown.
Never return plain text.
`,
        },

        ...history,
      ],
    });

    const aiResponse = completion.choices[0].message.content;

    history.push({
      role: "assistant",
      content: aiResponse,
    });

    return JSON.parse(aiResponse);
  } catch (error) {
    console.error(error);

    throw new Error("Failed to get AI response.");
  }
};