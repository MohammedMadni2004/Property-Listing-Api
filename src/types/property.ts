import { Types } from "mongoose";

export type Property = {
    id: string;
    title: string;
    type: 'Apartment' | 'Villa' | 'Bungalow' | 'Studio' | 'Penthouse';
    price: number;
    state: string;
    city: string;
    areaSqFt: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];        
    furnished: 'Furnished' | 'Unfurnished' | 'Semi';
    availableFrom: Date;
    listedBy: 'Builder' | 'Owner' | 'Agent';
    tags: string[];             
    colorTheme: string;
    rating: number;
    isVerified: boolean;
    listingType: 'sale' | 'rent';
    createdBy: Types.ObjectId; 
  };
  