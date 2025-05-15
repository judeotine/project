export type UserType = 'buyer' | 'seller' | 'admin';

export type User = {
  id: string;
  username: string;
  email: string;
  phone: string;
};

export type Profile = {
  profile_id: string;
  name: string;
  phone: string;
  avatar: string;
  user_type: UserType;
  is_active: boolean;
  trial_ads_count: number;
  is_banned: boolean;
  ban_reason?: string;
  user_id: User['id'];
  other: {
    preferences?: {};
  };
};

export type Shop = {
  shop_id: string;
  name: string;
  ads_count: number;
  ads_duration: number;
  ads_duration_units: string;
  price_per_ad: number;
  price_currency: string;
  ads_payment_id: Payment['payment_id'];
  description: string;
  profile_id: Profile['profile_id'];
  logo: string;
  rating: string;
  other: {
    location?: string;
  };
};

export type Product = {
  product_id: string;
  name: string;
  description: string;
  shop_id: Shop['shop_id'];
  price: number;
  price_currency: string;
  other: {
    images: string[];
    category?: string;
    variants?: string[];
    brand?: string[];
    condition?: string;
    model?: string;
  };
};

export type Service = {
  service_id: string;
  name: string;
  description: string;
  price: number;
  price_currency: string;
  other: {
    images: string[];
    category?: string;
    variants?: string[];
  };
};

type AdType = 'product' | 'service';

export type Ad = {
  advert_id: string;
  type: AdType;
  product_id?: Product['product_id'];
  service_id?: Service['service_id'];
  date_created: string;
  ad_lifetime: number;
  ad_lifetime_units: string;
  shop_id: Shop['shop_id'];
  isPromoted: boolean;
  promotion_lifetime: number;
  promotion_lifetime_units: string;
  promotion_cost: number;
  promotion_payment_id: Payment['payment_id'];
  promotion_currency: string;
  isTrending: boolean;
  is_active: boolean;
  discount_rate: number;
  views: number;
  other: {
    promo_codes?: string[];
    view_ids: string[];
  };
};

export type Review = {
  review_id: string;
  user_id: User['id'];
  ad_id: Ad['advert_id'];
  rating: number;
  comment: string;
};

type PaymentStatus = 'pending' | 'success' | 'failed';
type PaymentMode = 'cash' | 'mobile money' | 'card' | 'other';

export type Payment = {
  payment_id: string;
  amount: number;
  currency: string;
  reason: string;
  external_id: string;
  status: PaymentStatus;
  mode: PaymentMode;
  user_id: User['id'];
  phone: string;
  other: {};
};

type OrderStatus = 'pending' | 'success' | 'failed' | 'cancelled';

export type Order = {
  order_id: string;
  payment_id?: string;
  payment_mode: PaymentMode;
  status: OrderStatus;
  buyer_id: Profile['profile_id'];
  shop_id: Shop['shop_id'];
  is_delivered: boolean;
  buyer_order_comment?: string;
  seller_order_comment?: string;
  type: AdType;
  ad_id: Ad['advert_id'];
  ad_price: number;
  currency: string;
  quantity: number;
  other: {
    per_item_discount: number;
    order_discount: number;
    total_amount: number;
  };
};
