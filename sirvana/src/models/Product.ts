import mongoose from 'mongoose';

export interface IProduct {
  name: string;
  description: string;
  price: number;
  embedding: number[]; // Example: Assuming embedding is an array of numbers
  imageUrl: string;
}

const ProductsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  embedding: { type: [Number]}, // Define embedding as an array of numbers
});

export default mongoose.models.Products || mongoose.model('Products', ProductsSchema);
