const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const InvestorSchema = new Schema({
  // Auth Fields
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['investor'],
    default: 'investor'
  },

  // Personal Details
  name: { type: String, required: true, trim: true },
  phone: { type: String, trim: true },
  location: { type: String, trim: true },
  bio: { type: String, maxlength: 500 },

  // Professional Details
  company: { type: String, trim: true },
  designation: { type: String, trim: true },
  linkedinUrl: { type: String, trim: true },

  // Investment Preferences
  preferredDomains: [{ type: String, lowercase: true }],

}, { timestamps: true });

// Hash password before saving
InvestorSchema.pre('save', async function (next) {
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
InvestorSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Investor', InvestorSchema);
