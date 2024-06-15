import { NextRequest, NextResponse } from 'next/server';
import mongoose,{ObjectId} from 'mongoose';
import OpenAI from 'openai';
import Products from '../../../models/Product';
import generateEmbedding from '../../utils/utils.ts'

export async function POST(req: NextRequest) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI as string, { dbName: 'sirvana' });

    // Example: Fetch all products from MongoDB
    const products = await Products.find({}); // Adjust query as per your needs

    console.log(products, "checkout products");
    
    // Iterate over each product and generate embeddings
    for (let product of products) {
      const { _id, description } = product;

      // Generate embedding using OpenA
      console.log(product, "check product");
      const embeddingResponse = await generateEmbedding(description);

      console.log(embeddingResponse, "checkout embeddingResponse");

      // Validate embeddingResponse
      if (!Array.isArray(embeddingResponse)) {
        console.error(`Invalid embedding response for product with _id: ${_id}`);
        continue; // Skip this product if the embedding is not valid
      }
      
      const user = await Products.findById(_id)

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
      
    user.embedding = embeddingResponse
    await user.save()
    }

    // Disconnect from MongoDB
    await mongoose.disconnect();

    // Respond with success message
    return NextResponse.json({ message: 'Embeddings generated and products updated successfully' });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}
