import mongoose from "mongoose";

const emailTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  layoutHTML: {
    type: String,
    required: true,
  },
  layoutCSS: {
    type: String,
  },
  layoutJS: {
    type: String,
  },
  variables: {
    type: Map,
    of: String,
  },
  images: {
    type: [String], // Store image URLs
  },
  category: {
    type: String, // 'constant' or 'custom'
    default: "custom",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const EmailTemplate = mongoose.model("EmailTemplate", emailTemplateSchema);

export default EmailTemplate;
