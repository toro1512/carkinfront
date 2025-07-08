export interface Auction {
  id: string;
  carId: number;
  sellerId: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  reservePrice?: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'ended' | 'cancelled';
  bids: Bid[];
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  amount: number;
  timestamp: string;
  isWinning: boolean;
}

export interface CreateAuctionData {
  carId: number;
  title: string;
  description: string;
  startingPrice: number;
  reservePrice?: number;
  duration: number; // en horas
  startDate: string;
  termsAccepted: boolean;
}

export interface UserCar {
  id: number;
  make: string;
  model: string;
  year: number;
  image: string;
  isAvailableForAuction: boolean;
  currentAuctionId?: string;
}