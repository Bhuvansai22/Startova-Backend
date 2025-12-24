const mongoose = require('mongoose');
const { Schema } = mongoose;

const StartupSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  founderName: { type: String, required: true, trim: true },
  startupName: { type: String, required: true, trim: true, unique: true },
  foundedYear: { type: Number, min: 1900, max: new Date().getFullYear() },
  description: { type: String, default: '' },
  domain: { type: String, required: true, trim: true, lowercase: true },

  // Documents
  documents: [{ type: String }], // General documents (legacy)
  financialDocuments: [{
    name: { type: String, required: true },
    type: { type: String, enum: ['cashflow', 'balance_sheet', 'income_statement', 'other'], required: true },
    url: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now }
  }],

  // Future Plans & Ideas
  futurePlans: { type: String, default: '' },
  pitchIdeas: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],

  // Metrics
  viewCount: { type: Number, default: 0 },

  // Investment Tracking
  receivedInvestments: [{
    investorId: { type: Schema.Types.ObjectId, ref: 'Investor', required: true },
    investorName: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    equity: { type: Number },
    investmentDate: { type: Date, default: Date.now },
    notes: { type: String }
  }],
  totalFunding: { type: Number, default: 0 }, // Total amount received from all investors

  // Legacy field
  internsRequired: { type: Boolean, default: false },
}, { timestamps: true });

// Method to add received investment
StartupSchema.methods.addInvestment = async function (investmentData) {
  this.receivedInvestments.push(investmentData);
  this.totalFunding += investmentData.amount;
  return await this.save();
};

module.exports = mongoose.model('Startup', StartupSchema);
