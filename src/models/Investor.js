const mongoose = require('mongoose');
const { Schema } = mongoose;

const InvestmentSubSchema = new Schema({
  startupId: { type: Schema.Types.ObjectId, ref: 'Startup', required: true },
  startupName: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  equity: { type: Number }, // percentage (optional)
  investmentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'completed' },
  notes: { type: String }
}, { _id: true });

const InvestorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },

  // Personal Details
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  location: { type: String, trim: true },
  bio: { type: String, maxlength: 500 },

  // Professional Details
  company: { type: String, trim: true },
  designation: { type: String, trim: true },
  linkedinUrl: { type: String, trim: true },

  // Investment Preferences
  investmentRange: { type: String }, // e.g., "₹10L - ₹50L"
  minInvestment: { type: Number, default: 100000 }, // in INR
  maxInvestment: { type: Number, default: 10000000 }, // in INR
  preferredDomains: [{ type: String, lowercase: true }],
  preferredStages: [{ type: String, enum: ['seed', 'series-a', 'series-b', 'growth'], lowercase: true }],

  // Investment Tracking
  totalInvested: { type: Number, default: 0 }, // Total amount invested across all startups
  availableBalance: { type: Number, default: 5000000 }, // Available to invest (₹50L default)
  portfolio: [InvestmentSubSchema],

}, { timestamps: true });

// Method to add investment
InvestorSchema.methods.addInvestment = async function (investmentData) {
  this.portfolio.push(investmentData);
  this.totalInvested += investmentData.amount;
  this.availableBalance -= investmentData.amount;
  return await this.save();
};

// Method to check if can invest
InvestorSchema.methods.canInvest = function (amount) {
  return this.availableBalance >= amount && amount >= this.minInvestment && amount <= this.maxInvestment;
};

module.exports = mongoose.model('Investor', InvestorSchema);
