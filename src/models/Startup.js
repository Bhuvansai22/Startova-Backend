const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const StartupSchema = new Schema({
  // userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Removed

  // Auth Fields
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['startup'],
    default: 'startup'
  },

  founderName: { type: String, required: true, trim: true },
  startupName: { type: String, required: true, trim: true, unique: true },
  foundedYear: { type: Number, min: 1900, max: new Date().getFullYear() },
  description: { type: String, default: '' },
  domain: { type: String, required: true, trim: true, lowercase: true },

  // Documents
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

// Hash password before saving
StartupSchema.pre('save', async function (next) {
  // Only hash if password is modified or new
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
StartupSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to add received investment
StartupSchema.methods.addInvestment = async function (investmentData) {
  this.receivedInvestments.push(investmentData);
  this.totalFunding += investmentData.amount;
  return await this.save();
};

module.exports = mongoose.model('Startup', StartupSchema);
