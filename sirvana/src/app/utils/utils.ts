import OpenAI from 'openai';
import pako from 'pako';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
    dangerouslyAllowBrowser: true 
  });

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

  function compressHtml(html: string): string {
    const uint8Array = new TextEncoder().encode(html);
    const compressed = pako.gzip(uint8Array);
    return btoa(String.fromCharCode.apply(null, compressed as any));
  }

  export function embedProductsInText(products:any) {
    return products.map((product:any) => {
      return `
         <div class="flex flex-col mb-2 border-1 border-gray-200 bg-gray-200/20 rounded-xl hover:cursor-pointer" id="product-${escapeHtml(product._id)}">
          <div class="rounded-t-[10px]">
            <div class="relative p-2">
              <div class="rounded-t-[10px]">
                <div class="relative shadow-black/5 shadow-none rounded-large" style="max-width: fit-content;">
                  <img src="${escapeHtml(product.imageUrl)}" class="relative opacity-0 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large object-cover bg-gray-200 border-gray-200 rounded-t-xl z-0" alt="${escapeHtml(product.name)}" layout="fill" objectfit="cover" data-loaded="true">
                </div>
              </div>
            </div>
          </div>
          <div class="flex flex-col pb-4 px-3">
            <div class="text-primary font-medium text-base sm:text-lg"></div>
            <p class="text-gray-700 text-sm truncate capitalize pb-1">${escapeHtml(product.name)}</p>
            <p class="text-gray-700 text-foreground font-medium text-sm line-clamp-2">${escapeHtml(product.description)}</p>
          </div>
        </div>
      `;
    }).join('');
  }

export function escapeHtml(html:any) {
  return String(html).replace(/&/g, "&amp;")
                     .replace(/</g, "&lt;")
                     .replace(/>/g, "&gt;")
                     .replace(/"/g, "&quot;")
                     .replace(/'/g, "&#039;");
}

export function decompressHtml(compressedData: string) {
  const compressedBytes = atob(compressedData);
  const uint8Array = new Uint8Array(
    compressedBytes.split('').map(char => char.charCodeAt(0))
  );
  const decompressed = pako.inflate(uint8Array, { to: 'string' });
  return decompressed;
}
// - Only output JSON in the following format: { "answer": "response to user query and include saying like here are some productname recommendations:", "products": "${escapeHtml(compressedHtml)}" }`,

export async function searchAssistant(userMessage: string, productHtml: string): Promise<any> {
  const compressedHtml = compressHtml(productHtml);

  const messages = [
    {
      role: 'system',
      content: `You are an e-commerce search assistant. Generate a response based on the following instructions:
        - Respond to the user's query in a conversational manner.
        - Include product recommendations relevant to the query.
        - Only output JSON in the following format: { "answer": "response to user query and include saying like here are some productname recommendations:", "products": "${compressedHtml}" }`,
    },
    { role: 'user', content: `Answer this user query: ${userMessage}` },
  ] as any;

  try{
    const responseStream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages ,
      stream: true,
    });
  
    const chunks = [];
          for await (const chunk of (responseStream as any).iterator()) {
            if(chunk.choices[0]?.delta?.content){
              chunks.push(chunk.choices[0].delta.content);
            }
          }
          const jsonResponse = chunks.join('');

                 const outputJson = JSON.parse(jsonResponse);
                console.log(outputJson, "test jsonResponse:")
  
      return outputJson;
  }catch(e){
    console.error(e)
  }
}