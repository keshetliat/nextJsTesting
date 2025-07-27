export interface Teacher {
  id: number;
  name: string;
  subject: string;
}

export interface Student {
  id: number;
  name: string;
  grade: number;
  subjects: string[];
  schedule: Schedule[];
}

export interface Schedule {
  day: string;
  time: string;
  subject: string;
  teacher: string;
}

export interface LessonDetails {
  schedule: Schedule;
  teacher: Teacher;
  students: Student[];
} 
export interface Author {
  AuthorID: number;
  AuthorName: string;
}

export interface Category {
  CategoryID: number;
  CategoryName: string;
}

export interface Publisher {
  PublisherID: number;
  PublisherName: string;
}

export interface ProductPrices {
  RetailPrice: number | null;
  PrintedBargainPrice: number | null;
  PrintedOriginalPrice: number | null;
  PrintedClubMemberPrice: number | null;
  AudioOriginalPrice: number | null;
  AudioBargainPrice: number | null;
  AudioClubMemberPrice: number | null;
  DigitalOriginalPrice: number | null;
  DigitalBargainPrice: number | null;
  DigitalClubMemberPrice: number | null;
}

export interface Product {
  ProductID: number;
  ProductName: string;
  Authors: Author[];
  PublishYear: number | null;
  PublishMonth: number | null;
  ProductPrices: ProductPrices;
  Categories: Category[];
  AllTimeOrders: number | null;
  ProductFormat: number;
  Image: string;
  CountReviews: number | null;
  AvgReviews: number | null;
  ProductType: number;
  Publishers: Publisher[];
  NumOfPages: string | null;
  Description: string;
  AudioDuration: number | null;
}
