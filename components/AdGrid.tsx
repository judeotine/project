import type { Ad, Product, Service } from '@/types/types';
import AdCard from './AdCard';

interface AdGridProps {
  ads: Ad[];
  products: Product[];
  services: Service[];
}

export default function AdGrid({ ads, products, services }: AdGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {ads.map((ad) => {
        const item =
          ad.type === 'product'
            ? products.find((p) => p.product_id === ad.product_id)
            : services.find((s) => s.service_id === ad.service_id);

        if (!item) return null;

        return <AdCard key={ad.advert_id} ad={ad} item={item} />;
      })}
    </div>
  );
}
