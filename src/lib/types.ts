export type MenuItem = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isAvailable: boolean | string;
  customVariants?: string[];
  moods?: string[];
  badge?: string;
  caffeineLevel?: string;
  sweetnessLevel?: string;
};

export type CartItem = MenuItem & {
  quantity: number;
  notes?: string;
  variant?: string;
};

export type VoucherConfig = {
  voucherActive: boolean;
  voucherCode: string;
  voucherDiscount: number;
};

export type PackageItem = {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  image: string;
  itemsIncluded: string[];
  customVariants?: string[];
  description: string;
};

export type CafeSpot = {
  id: string;
  title: string;
  category: "Indoor Lounge" | "Outdoor Garden" | "Working Nook" | "Barista Corner" | "Rooftop Terrace";
  image: string;
  description: string;
  ambiance: string;
  capacity: string;
  features: string[];
};

