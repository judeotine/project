'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

const shopSchema = z.object({
  name: z.string().min(3, 'Shop name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(3, 'Location is required'),
  logo: z.string().url('Invalid logo URL'),
});

export default function CreateShopPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    logo: '',
  });
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      shopSchema.parse(formData);
      // Here you would typically send the data to your backend
      console.log('Shop creation data:', formData);
      toast.success('Shop created successfully!');
      router.push('/'); // Redirect to home page or shop dashboard after successful creation
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-amber-600">
            Create Your Shop
          </CardTitle>
          <CardDescription>Set up your shop on shift-market</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Shop Name
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location
              </label>
              <Input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="logo" className="text-sm font-medium">
                Logo URL
              </label>
              <Input
                id="logo"
                name="logo"
                type="url"
                required
                value={formData.logo}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700">
              Create Shop
            </Button>
          </CardFooter>
        </form>
      </Card>
      <div className="mt-8 p-4 bg-slate-200 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Shop Details:</h3>
        <p>Number of ads allowed: 10</p>
        <p>Price per ad: $1 per month</p>
        <p>Ad duration: 30 days</p>
      </div>
    </div>
  );
}
