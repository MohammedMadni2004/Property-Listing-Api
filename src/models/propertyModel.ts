// src/modules/property/property.model.ts

import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  property_type: { type: String, required: true },
  price: { type: Number, required: true },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  area_sqft: { type: Number },
  year_built: { type: Number },
  listed_date: { type: Date },
  description: { type: String },
  agent_name: { type: String },
  agent_email: { type: String },
  image_url: { type: String },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const PropertyModel = mongoose.model('Property', propertySchema);
