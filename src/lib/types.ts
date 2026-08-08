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
