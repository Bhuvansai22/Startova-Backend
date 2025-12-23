const mongoose = require('mongoose');
const { Schema } = mongoose;

const InternSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  skills: [{ type: String }],
  resume: { type: String },
  appliedStartups: [{ type: Schema.Types.ObjectId, ref: 'Startup' }],
}, { timestamps: true });

module.exports = mongoose.model('Intern', InternSchema);
