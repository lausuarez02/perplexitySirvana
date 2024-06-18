import { NextRequest, NextResponse } from 'next/server';
import mongoose,{Connection} from 'mongoose';
import OpenAI from 'openai';
import Products from '../../../models/Product';
import {generateEmbedding, searchAssistant, embedProductsInText} from '../../utils/utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true 
});

export async function POST(req: NextRequest) {
    try {
      if (!process.env.MONGO_URI) {
        console.error("Error: MONGO_URI environment variable is not defined.");
      }
      
      if (!mongoose.connection.readyState) {
         await mongoose.connect(process.env.MONGO_URI as string,{
          dbName: 'sirvana', // Specify database name if needed
        });
      }

      const { query } = await req.json();
      const embedding = await generateEmbedding(query); 
  
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
    
      const aggCursor = Products.aggregate(aggPipeline as any);
  
      const products = [];
      for await (const doc of aggCursor) {
        products.push(doc);
      }

      const productHtml = embedProductsInText(products);
      const searchResult = products.map(product => `id: ${product.id}, description: ${product.description}`).join('\n');
  
      const responseStream = await searchAssistant(query, productHtml);

      // Disconnect from MongoDB
      await mongoose.disconnect();
      return NextResponse.json({ responseStream });
    } catch (error) {
      console.error('Error processing request:', error);
      return NextResponse.json({ error: 'Internal Server Error' });
    }
  }
