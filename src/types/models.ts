export interface User {
  id: string;
  email: string;
  phone?: string;
  userType: 'buyer' | 'seller';
  subscriptionType: 'free' | 'premium';
  createdAt: string;
  lastLoginAt: string;
}

export interface TreeListing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  treeType?: string;
  plantingType?: 'potted' | 'in-ground';
  images: {
    url: string;
    type: 'image' | 'video';
    isPremium: boolean;
  }[];
  location: {
    latitude: number;
    longitude: number;
    address: string;
    state: string;
    isVisible: boolean;
  };
  status: 'active' | 'sold' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  searchRadius: number; // in miles
  preferredStates: string[];
  notifications: {
    email: boolean;
    push: boolean;
  };
  savedListings: string[]; // Array of listing IDs
}

export interface LocationFilters {
  radius: number;
  center: {
    latitude: number;
    longitude: number;
  };
  state?: string;
  treeTypes?: string[];
  priceRange?: {
    min: number;
    max: number;
  };
  plantingTypes?: ('potted' | 'in-ground')[];
}