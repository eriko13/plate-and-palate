export type Cook = {
  slug: string;
  name: string;
  handle: string;
  location: string;
  bio: string;
  story: string;
  avatar: string;
  specialty: string;
};

export type Dish = {
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  cookSlug: string;
  rating: number;
  reviewCount: number;
  prepTime: string;
  tags: string[];
};

export type DishFilters = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
};
