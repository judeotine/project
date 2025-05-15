'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import AdGrid from '@/components/AdGrid';
import { supabase } from '@/utils/supabase-client';
import { Shop, Ad, Product, Service } from '@/types/types';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import NotFound from '@/app/not-found-page';

export default function ShopPage({ params }: { params: { shop_id: string } }) {
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopAds, setShopAds] = useState<Ad[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchShopData() {
      try {
        // Fetch shop data
        const { data: shopData, error: shopError } = await supabase
          .from('shops')
          .select('*')
          .eq('shop_id', params.shop_id)
          .single();

        if (shopError || !shopData) {
          toast.error('Shop not found');
          return <NotFound />;
        }

        setShop(shopData as Shop);

        // Fetch ads for this shop
        const { data: adsData, error: adsError } = await supabase
          .from('ads')
          .select('*')
          .eq('shop_id', params.shop_id)
          .eq('is_active', true);

        if (adsError) {
          toast.error('Error loading shop ads');
          console.error('Error fetching shop ads:', adsError);
          return;
        }

        setShopAds((adsData as Ad[]) || []);

        // Get product IDs and service IDs from ads
        const productIds =
          adsData
            ?.filter((ad) => ad.type === 'product' && ad.product_id)
            .map((ad) => ad.product_id) || [];

        const serviceIds =
          adsData
            ?.filter((ad) => ad.type === 'service' && ad.service_id)
            .map((ad) => ad.service_id) || [];

        // Fetch products if there are any product ads
        if (productIds.length > 0) {
          const { data: productsData, error: productsError } = await supabase
            .from('products')
            .select('*')
            .in('product_id', productIds);

          if (productsError) {
            toast.error('Error loading products');
            console.error('Error fetching products:', productsError);
          } else {
            setProducts((productsData as Product[]) || []);
          }
        }

        // Fetch services if there are any service ads
        if (serviceIds.length > 0) {
          const { data: servicesData, error: servicesError } = await supabase
            .from('services')
            .select('*')
            .in('service_id', serviceIds);

          if (servicesError) {
            toast.error('Error loading services');
            console.error('Error fetching services:', servicesError);
          } else {
            setServices((servicesData as Service[]) || []);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchShopData();
  }, [params.shop_id]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <p>Loading shop details...</p>
      </div>
    );
  }

  if (!shop) {
    return <NotFound />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-amber-600">
            {shop.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-start space-x-6">
          <Image
            src={shop.logo || '/placeholder.svg'}
            alt={shop.name}
            width={100}
            height={100}
            className="rounded-full"
          />
          <div>
            <p>
              <strong>Description:</strong> {shop.description}
            </p>
            <p>
              <strong>Location:</strong>{' '}
              {shop.other?.location || 'Not specified'}
            </p>
            <p>
              <strong>Rating:</strong> {shop.rating}
            </p>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-semibold mb-4">Products and Services</h2>
      {shopAds.length > 0 ? (
        <AdGrid ads={shopAds} products={products} services={services} />
      ) : (
        <p className="text-center py-8 text-gray-500">
          This shop doesn't have any active listings yet.
        </p>
      )}
    </div>
  );
}
