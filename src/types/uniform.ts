export type UniformCategory = 'jerseys' | 'streetwear' | 'tracksuits' | 'footwear' | 'bags';

export type SportType =
  | 'All'
  | 'Streetwear'
  | 'Football'
  | 'Cricket'
  | 'Basketball'
  | 'Volleyball'
  | 'Hockey'
  | 'Rugby'
  | 'Athletics'
  | 'Baseball'
  | 'Cycling'
  | 'Badminton';

export type GarmentSilhouette =
  | 'jersey_crew'
  | 'jersey_polo'
  | 'jersey_sleeveless'
  | 'jersey_vneck'
  | 'jersey_longsleeve'
  | 'jersey_button'
  | 'street_hoodie'
  | 'street_varsity'
  | 'street_crewneck'
  | 'tracksuit_puffer'
  | 'tracksuit_zip'
  | 'tracksuit_hoodie'
  | 'shoe_hightop'
  | 'shoe_cleat'
  | 'shoe_runner'
  | 'shoe_court'
  | 'bag_wheelie'
  | 'bag_duffel'
  | 'bag_hardcase'
  | 'bag_backpack';

export type GarmentPattern =
  | 'solid'
  | 'stripes'
  | 'chevron'
  | 'gradient'
  | 'sash'
  | 'puffer'
  | 'colorblock';

export interface Colorway {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  trim: string;
  hueDeg?: number;
  saturate?: number;
  brightness?: number;
}

export interface UniformItem {
  id: string;
  sku: string;
  name: string;
  category: UniformCategory;
  sport: Exclude<SportType, 'All'>;
  silhouette: GarmentSilhouette;
  pattern: GarmentPattern;
  imageUrl: string;
  modelImageUrl: string;
  actionBackdropUrl: string;
  actionBackdropPosition?: string;
  fabricSpec: string;
  stitchingSpec: string;
  printingMethod: string;
  bottomStyle: 'shorts' | 'trackpants' | 'trousers' | 'tights';
  moq: number;
  unitPriceUsd: number;
  leadTimeDays: string;
  description: string;
  colorways: Colorway[];
}

export interface EquippedSlot {
  item: UniformItem;
  colorwayIndex: number;
}

export interface EquippedKit {
  top: EquippedSlot;
  streetwear: EquippedSlot;
  tracksuit: EquippedSlot;
  activeTopLayer: 'jersey' | 'streetwear' | 'tracksuit';
  footwear: EquippedSlot;
  bag: EquippedSlot;
  showBagOnStage: boolean;
  squadNumber: string;
  teamName: string;
}

export interface SizeBreakdown {
  S: number;
  M: number;
  L: number;
  XL: number;
  XXL: number;
}

export interface QuoteOrderItem {
  uid: string;
  item: UniformItem;
  colorway: Colorway;
  squadNumber: string;
  teamName: string;
  sizes: SizeBreakdown;
  totalQty: number;
  unitPriceAfterTier: number;
}
