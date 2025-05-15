'use client';

import { useEffect, useMemo, useState } from 'react';
import { TrendingUp, Wrench, Store, Loader2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import InlineFilters from '@/components/InlineFilters';
import ContentSkeleton from '@/components/ContentSkeleton';
import { HomeHero } from '@/components/home-hero';
import { supabase } from '@/utils/supabase-client';
import { toast } from 'sonner';
import { ProductsGrid } from '@/components/products-grid';
import { ServicesGrid } from '@/components/services-grid';
import { ShopsGrid } from '@/components/shops-grid';
import { FeaturedCategories } from '@/components/featured-categories';

const itemsPerPage = 6;

export default function HomePage() {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState<any[]>([]);
  const [featuredShops, setFeaturedShops] = useState<any[]>([]);
  const [allTrendingAds, setAllTrendingAds] = useState<any[]>([]);

  // Fetch all trending ads (products & services) once along with other data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [categoriesData, shopsData, trendingAdsData] = await Promise.all([
          fetchCategories(),
          fetchFeaturedShops(),
          fetchTrendingAds(),
        ]);

        setCategories(categoriesData || []);
        setFeaturedShops(shopsData || []);
        setAllTrendingAds(trendingAdsData || []);
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast.error('Failed to load initial data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Use memoization to split trending ads into products and services
  const { filteredProducts, filteredServices } = useMemo(() => {
    // Separate out products and services using the type flag
    let products = allTrendingAds.filter((ad) => ad.type === 'product');
    let services = allTrendingAds.filter((ad) => ad.type === 'service');

    // If a category filter exists, apply it only on products.
    if (filters.category) {
      products = products.filter(
        (ad) => ad.products?.category_id === filters.category
      );
    }

    // If a price range filter exists, apply it on products
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      products = products.filter((ad) => {
        const price = ad.products?.price ?? 0;
        return price >= min && price <= max;
      });
    }

    return { filteredProducts: products, filteredServices: services };
  }, [allTrendingAds, filters]);

  // Paginate the filtered products. Showing items for pages 1, 2, etc.
  const paginatedProducts = useMemo(() => {
    const start = 0;
    const end = page * itemsPerPage;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, page]);

  const hasMore = filteredProducts.length > paginatedProducts.length;

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-amber-600 to-amber-400 --mt-8">
        <HomeHero />
        <HomeTabs />
      </section>

      <div className="container mx-auto px-4 py-16 md:pb-24">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <InlineFilters
            onFilterChange={(newFilters) => {
              setFilters(newFilters);
              setPage(1); // reset pagination when filters change
            }}
          />
        </div>

        {/* Tab Content */}
        <Tabs defaultValue="home">
          <TabsContent value="home" className="mt-0">
            <FeaturedCategories categories={categories} />

            {/* Products Grid */}
            <div className="space-y-8">
              <h2 className="text-xl font-semibold">Featured Products</h2>
              {isLoading && page === 1 ? (
                <ContentSkeleton />
              ) : (
                <>
                  <ProductsGrid products={paginatedProducts} />

                  {hasMore && (
                    <LoadMoreButton
                      isLoading={isLoading}
                      onLoadMore={handleLoadMore}
                    />
                  )}
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="m-0">
            <ProductsGrid products={paginatedProducts} />
          </TabsContent>

          <TabsContent value="services" className="m-0">
            <ServicesGrid services={filteredServices} />
          </TabsContent>

          <TabsContent value="shops" className="m-0">
            <ShopsGrid shops={featuredShops} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Tab Navigation Component
const HomeTabs = () => (
  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-2xl px-4">
    <div className="bg-white rounded-lg shadow-lg">
      <Tabs defaultValue="home" className="w-full">
        <TabsList className="w-full grid grid-cols-4 cursor-pointer">
          <TabsTrigger asChild value="home">
            <div className="flex items-center justify-center data-[state=active]:bg-amber-50">
              <Home className="h-4 w-4 mr-2" />
              Home
            </div>
          </TabsTrigger>
          <TabsTrigger asChild value="trending">
            <div className="flex items-center justify-center data-[state=active]:bg-amber-50">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </div>
          </TabsTrigger>
          <TabsTrigger asChild value="services">
            <div className="flex items-center justify-center data-[state=active]:bg-amber-50">
              <Wrench className="h-4 w-4 mr-2" />
              Services
            </div>
          </TabsTrigger>
          <TabsTrigger asChild value="shops">
            <div className="flex items-center justify-center data-[state=active]:bg-amber-50">
              <Store className="h-4 w-4 mr-2" />
              Shops
            </div>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  </div>
);

// Load More Button Component
const LoadMoreButton = ({
  isLoading,
  onLoadMore,
}: {
  isLoading: boolean;
  onLoadMore: () => void;
}) => (
  <div className="flex justify-center mt-8">
    <Button onClick={onLoadMore} disabled={isLoading} className="min-w-[200px]">
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : (
        'Load More'
      )}
    </Button>
  </div>
);

//
// 🔌 Supabase Fetch Functions (they can be moved to a separate file if needed)
//

async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  return data;
}

async function fetchFeaturedShops() {
  const { data, error } = await supabase.from('shops').select('*').limit(4);
  if (error) throw error;
  return data;
}

async function fetchTrendingAds() {
  // Fetch all trending ads, regardless of whether they are a product or a service
  const { data, error } = await supabase
    .from('ads')
    .select(
      `
      *,
      products:product_id(*),
      services:service_id(*),
      shops:shop_id(*)
    `
    )
    .eq('is_trending', true);
  if (error) throw error;
  return data;
}
