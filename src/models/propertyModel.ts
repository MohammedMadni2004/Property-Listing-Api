import mongoose, { Schema, model } from 'mongoose';

const PropertySchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['Apartment', 'Villa', 'Bungalow', 'Studio', 'Penthouse'], required: true },
  price: { type: Number, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  areaSqFt: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  amenities: { type: [String], required: true },
  furnished: { type: String, enum: ['Furnished', 'Unfurnished', 'Semi'], required: true },
  availableFrom: { type: Date, required: true },
  listedBy: { type: String, enum: ['Builder', 'Owner', 'Agent'], required: true },
  tags: { type: [String], required: true },
  colorTheme: { type: String, required: true },
  rating: { type: Number, required: true },
  isVerified: { type: Boolean, required: true },
  listingType: { type: String, enum: ['sale', 'rent'], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
});

export const PropertyModel = model('Property', PropertySchema);
