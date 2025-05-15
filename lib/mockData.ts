export interface Service {
  service_id: string
  name: string
  description: string
  price: number
  price_currency: string
  other: {
    images: string[]
    category: string
  }
}

export interface Ad {
  advert_id: string
  type: string
  service_id: string
  date_created: string
  ad_lifetime: number
  ad_lifetime_units: string
  shop_id: string
  isPromoted: boolean
  promotion_lifetime: number
  promotion_lifetime_units: string
  promotion_cost: number
  promotion_currency: string
  isTrending: boolean
  is_active: boolean
  discount_rate: number
  views: number
  other: {
    view_ids: string[]
  }
}

export const mockServices: Service[] = [
  {
    service_id: "service1",
    name: "Phone Repair",
    description: "Quick and reliable phone repair service",
    price: 50,
    price_currency: "USD",
    other: {
      images: ["/placeholder.svg"],
      category: "Electronics Repair",
    },
  },
  {
    service_id: "service2",
    name: "Professional Photography",
    description: "Capture your special moments with our expert photographers",
    price: 200,
    price_currency: "USD",
    other: {
      images: ["/placeholder.svg"],
      category: "Photography",
    },
  },
  {
    service_id: "service3",
    name: "House Cleaning",
    description: "Professional cleaning services for your home",
    price: 80,
    price_currency: "USD",
    other: {
      images: ["/placeholder.svg"],
      category: "Home Services",
    },
  },
  {
    service_id: "service4",
    name: "Personal Training",
    description: "Customized fitness programs with certified trainers",
    price: 60,
    price_currency: "USD",
    other: {
      images: ["/placeholder.svg"],
      category: "Fitness",
    },
  },
]

// Add corresponding ads for the new services
export const mockServiceAds: Ad[] = [
  {
    advert_id: "ad3",
    type: "service",
    service_id: "service2",
    date_created: "2023-01-03",
    ad_lifetime: 30,
    ad_lifetime_units: "days",
    shop_id: "shop1",
    isPromoted: true,
    promotion_lifetime: 7,
    promotion_lifetime_units: "days",
    promotion_cost: 5,
    promotion_currency: "USD",
    isTrending: true,
    is_active: true,
    discount_rate: 10,
    views: 800,
    other: {
      view_ids: [],
    },
  },
  // ... (add more service ads)
]

