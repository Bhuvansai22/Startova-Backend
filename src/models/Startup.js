const mongoose = require('mongoose');
const { Schema } = mongoose;

const StartupSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  founderName: { type: String, required: true, trim: true },
  startupName: { type: String, required: true, trim: true, unique: true },
  description: { type: String, default: '' },
  domain: { type: String, required: true, trim: true, lowercase: true },
  documents: [{ type: String }],
  internsRequired: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Startup', StartupSchema);
