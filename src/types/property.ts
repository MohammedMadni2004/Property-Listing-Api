import { Types } from "mongoose";

export type PropertyType = 'Apartment' | 'Villa' | 'Bungalow' | 'Studio' | 'Penthouse';
export type FurnishingType = 'Furnished' | 'Unfurnished' | 'Semi';
export type ListedBy = 'Builder' | 'Owner' | 'Agent';
export type ListingType = 'sale' | 'rent';

export type Property = {
  id: string;
  title: string;
  type: PropertyType;
  price: number;
  state: string;
  city: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];        
  furnished: FurnishingType;
  availableFrom: Date;
  listedBy: ListedBy;
  tags: string[];             
  colorTheme: string;
  rating: number;
  isVerified: boolean;
  listingType: ListingType;
  createdBy: Types.ObjectId; 
};
