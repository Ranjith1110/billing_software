import Counter from '../models/counterModel.js';

export const generateItemCode = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'itemCode' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.seq).padStart(3, '0');
  return `vig${padded}`;
};
