import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
  });

  type Chunk = {
    choices: {
      delta?: {
        content?: string;
      };
    };
  };
export async function generateEmbedding(inputText: string): Promise<number[] | null> {
    try {
      const vectorEmbedding = await openai.embeddings.create({
        input: inputText,
        model: 'text-embedding-ada-002',
      });
      const embedding = vectorEmbedding.data[0].embedding;
      return embedding;
    } catch (error) {
      console.error('Error processing request:', error);
      return null
    }
  }

export async function searchAssistant(userMessage: string): Promise<any> {
    try {
      const responseStream = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {
              role: 'system',
              content: `You are an e-commerce search assistant. Generate a response based on the following instructions:
              - Respond to the user's query in a conversational manner.
              - Include product recommendations relevant to the query.
              - Only output JSON in the following format: { "answer": "response to user query and include saying like here are some productname recommendations:"}`,
            },
            { role: 'user', content: userMessage },
          ],
        stream: true,
      });
      let jsonResponse = '';
      for await (const chunk of (responseStream as any).iterator()) {
        jsonResponse += chunk.choices[0]?.delta?.content || '';
      }
  
      // Log the completion response for debugging
      console.log(responseStream, "responseStream response");
  
      const outputJson = JSON.parse(jsonResponse);
  
      return outputJson;
    } catch (error) {
      console.error('Error in searchAssistant:', error);
      return null;
    }
  }
  