const mongoose = require('mongoose');
const { Schema } = mongoose;

const InvestmentSubSchema = new Schema({
  startup: { type: Schema.Types.ObjectId, ref: 'Startup' },
  amount: { type: Number },
  currency: { type: String, default: 'USD' },
  equity: { type: Number }, // percentage (optional)
  date: { type: Date, default: Date.now },
  notes: { type: String }
}, { _id: false });

const InvestorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  investmentRange: { type: String },
  preferredDomains: [{ type: String, lowercase: true }],
  portfolio: [InvestmentSubSchema],
}, { timestamps: true });

module.exports = mongoose.model('Investor', InvestorSchema);
