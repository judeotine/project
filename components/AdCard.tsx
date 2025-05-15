import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Ad, Product, Service } from '@/types/types';

interface AdCardProps {
  ad: Ad;
  item: Product | Service;
}

export default function AdCard({ ad, item }: AdCardProps) {
  return (
    <Card className="overflow-hidden">
      <Image
        src={item.other.images[0] || '/placeholder.svg'}
        alt={item.name}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold">{item.name}</h2>
          {ad.isPromoted && (
            <Badge variant="secondary" className="bg-amber-200 text-amber-800">
              Promoted
            </Badge>
          )}
        </div>
        <p className="text-gray-600 mb-2">{item.description}</p>
        <p className="text-lg font-bold text-amber-600">
          {item.price} {item.price_currency}
        </p>
        {ad.discount_rate > 0 && (
          <p className="text-sm text-green-600">{ad.discount_rate}% off</p>
        )}
      </CardContent>
      <CardFooter className="p-4">
        <Link
          href={`/${ad.type}/${
            ad.type === 'product' ? ad.product_id : ad.service_id
          }`}
          className="w-full">
          <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded">
            View Details
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
}
