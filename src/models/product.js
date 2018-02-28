import mongoose from 'mongoose';
import Counter from './counter';

const productSchema = new mongoose.Schema({
  productId: { type: Number },
  name: { type: String, required: true },
  description: { type: String },
  unitsInStock: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  dateAdded: { type: Date, default: Date.now(), required: true },
});

productSchema.pre('save', function handler(next) {
  // incremental product id implemention
  if (this.isNew) {
    Counter.findByIdAndUpdate(
      { _id: 'productId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
    ).then((counter) => {
      this.productId = counter.seq;
      next();
    }).catch(err => next(err));
  } else next();
});

export default mongoose.model('Product', productSchema);
