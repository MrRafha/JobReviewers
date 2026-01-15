// Types baseados no schema do Prisma

export interface User {
  id: string;
  email: string;
  handle: string;
  verifiedEmail: boolean;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  city?: string;
  state?: string;
  createdAt: Date;
  reviews?: Review[];
  _count?: {
    reviews: number;
  };
}

export interface Review {
  id: string;
  companyId: string;
  userId: string;
  roleArea: string;
  seniority: 'jr' | 'pl' | 'sr';
  contractType: 'clt' | 'pj' | 'estagio';
  workMode: 'remoto' | 'hibrido' | 'presencial';
  year: number;
  ratingOverall: number;
  pros: string;
  cons: string;
  hidden: boolean;
  createdAt: Date;
  company?: Company;
  user?: User;
}

export interface Report {
  id: string;
  reviewId: string;
  reporterUserId: string;
  reason: string;
  createdAt: Date;
  resolvedAt?: Date;
  review?: Review;
  reporter?: User;
}

// DTOs (Data Transfer Objects)
export interface CreateReviewInput {
  companyId: string;
  roleArea: string;
  seniority: 'jr' | 'pl' | 'sr';
  contractType: 'clt' | 'pj' | 'estagio';
  workMode: 'remoto' | 'hibrido' | 'presencial';
  year: number;
  ratingOverall: number;
  pros: string;
  cons: string;
}

export interface CreateReportInput {
  reviewId: string;
  reason: string;
}

// UI Types
export interface CompanyWithStats extends Company {
  averageRating: number;
  totalReviews: number;
}
