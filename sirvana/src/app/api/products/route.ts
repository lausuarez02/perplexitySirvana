import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import OpenAI from 'openai';
import Product from '../../../../src/models/Product';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(req: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    const { query } = await req.json();
    console.log(query, "checkout the query dude");

    const responseStream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: query }],
      stream: true,
    });

    const decoder = new TextDecoder();
    const reader = responseStream[Symbol.asyncIterator]();

    let text = '';
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.next();
      if (readerDone) {
        done = readerDone;
        text += decoder.decode(value?.choices[0]?.delta?.content || new Uint8Array(), { stream: true });
      }
    }

    const productIds = extractProductIds(text);
    const products = await Product.find({ _id: { $in: productIds } });
    const formattedResponse = embedProductsInText(text, products);

    return NextResponse.json({ formattedResponse });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal Server Error' });
  }
}

const extractProductIds = (text: string): string[] => {
  const matches = text.match(/`product card (\d+)`/g);
  return matches ? matches.map(match => match.replace(/`product card (\d+)`/, '$1')) : [];
};

const embedProductsInText = (text: string, products: any[]): string => {
  let formattedText = text;
  products.forEach(product => {
    const productCard = `
      <div class="product-card">
        <img src="${product.imageUrl}" alt="${product.name}" />
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
      </div>`;
    formattedText = formattedText.replace(`\`product card ${product._id}\``, productCard);
  });
  return formattedText;
};
