import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  stock: number;
  createdBy: mongoose.Types.ObjectId;  // Add this
  updatedBy: mongoose.Types.ObjectId;  // Add this
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    index: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    unique: true,
    index: true
  },
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});


productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

export const Product = mongoose.model<IProduct>('Product', productSchema);