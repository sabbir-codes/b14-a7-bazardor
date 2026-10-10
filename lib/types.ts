export interface MarketPrice {
  name: string;
  division: string;
  min: number;
  max: number;
  price: number; // midpoint of min..max
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  unit: string; // "প্রতি কেজি"
  price: number;
  prevPrice: number | null;
  changePct: number; // signed percent, + up / - down
  changeAmount: number | null; // signed taka
  category: string; // category slug
  categoryName: string;
  description: string;
  markets: MarketPrice[];
  min: number;
  max: number;
  avg: number;
}

export interface Category {
  slug: string;
  name: string;
  emoji: string;
}
