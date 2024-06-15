import { NextRequest, NextResponse } from 'next/server';
import mongoose,{ObjectId} from 'mongoose';
import OpenAI from 'openai';
import Products from '../../../models/Product';
import {generateEmbedding, searchAssistant} from '../../utils/utils.ts'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

function embedProductsInText(products) {
  let textTemplate = "";

  products.forEach((product, index) => {
    const productCard = `
    <div class="flex flex-col mb-2 border-1 border-gray-200 bg-gray-200/20 rounded-xl hover:cursor-pointer" id="product-${product._id}">
      <div class="rounded-t-[10px]">
      <div class="relative p-2">
      <div class="rounded-t-[10px]">
        <div class="relative shadow-black/5 shadow-none rounded-large" style="max-width: fit-content;">
          <img src="${product.imageUrl}" class="relative opacity-0 shadow-black/5 data-[loaded=true]:opacity-100 shadow-none transition-transform-opacity motion-reduce:transition-none !duration-300 rounded-large object-cover bg-gray-200 border-gray-200 rounded-t-xl z-0" alt="${product.name}" layout="fill" objectfit="cover" data-loaded="true">
        </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col pb-4 px-3">
    <div class="text-primary font-medium text-base sm:text-lg">
    </div>
    <p class="text-gray-700 text-sm truncate capitalize pb-1">${product.name}</p>
    <p class="text-gray-700 text-foreground font-medium text-sm line-clamp-2">${product.description}</p>
  </div>
      </div>

      `;
    textTemplate += productCard;
  });

  return textTemplate;
}

export async function POST(req: NextRequest) {
    try {
      // Connect to MongoDB
      let client = ''
      if (!mongoose.connection.readyState) {
        client = await mongoose.connect(process.env.MONGO_URI as string,{
          useNewUrlParser: true,
          useUnifiedTopology: true,
          dbName: 'sirvana', // Specify database name if needed
        });
      }

      const { query } = await req.json();
      const embedding = await generateEmbedding(query); 
  
      const gptResponse = (await searchAssistant(query));
      const aggPipeline = [
        {
          $vectorSearch: {
            index: 'vector_sirvana_index',
            queryVector: embedding,
            path: 'embedding',
            numCandidates: 150,
            limit: 10,
          }
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            price: 1,
            imageUrl: 1,
            score:{
              $meta: 'vectorSearchScore'
            }
          }
        }
      ];
    
      const aggCursor = Products.aggregate(aggPipeline);
      console.log('Aggregation Cursor:', aggCursor);
  
      const products = [];
      for await (const doc of aggCursor) {
        products.push(doc);
      }

      const productText = embedProductsInText(products);
  
      console.log('productText:', productText);

      // Disconnect from MongoDB
      await mongoose.disconnect();
      return NextResponse.json({ products, productText, gptResponse });
    } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json({ error: 'Internal Server Error' });
    }
  }
