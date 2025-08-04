export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'librarian' | 'user';
  createdAt: string;
}

export interface Client {
  clientId: number;
  name: string;
  email: string;
  isEnabled: boolean;
}

export interface Item {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  description: string;
  coverUrl?: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
  updatedAt: string;
  itemType: string;
  yearPublished: number;
  availabilityStatus: string | 'available' | 'borrowed' | 'pending_borrow_approval' | 'pending_return_approval';
  available: boolean;
  enabled: boolean;
  borrowedOn?: string;
  returnedOn?: string;
  actionDate: Date;
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  userId: string;
  title: string;
  author: string;
  dateBorrowed: string;
  returnedAt?: string;
  genre: string;
  publishedYear: number;
  borrowedAt: string;
  dueDate: string;
  status: 'borrowed' | 'returned';
}

export interface Review {
  reviewId: number;
  client: Client;
  item: Item;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  anonymous: boolean;
}

export interface ReviewDTO {
  reviewId: number;
  rating: number;
  comment: string;
  isAnonymous: boolean;
}

export interface UpdateReviewDTO {
  reviewId: number;
  rating: number;
  comment: string;
  isAnonymous: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Auth types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    role: 'ADMIN' | 'LIBRARIAN' | 'USER';
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface RegisterResponse {
  message: string;
}

export interface Borrow {
  requestId: number;
  item: Item;
  client: Client;
  status: 'borrow_requested' | 'borrow_declined' | 'borrowed' | 'return_requested' | 'return_declined' | 'returned';
  borrowDate: string;
  returnDate: string;
  actionDate: string;
}

export interface BorrowRequest {
  itemTitle: string;
  itemType: string;
  authorName: string;
}

export interface RequestResponse {
  item: Item;
  client: Client;
  responseReason: LibrarianReason;
}

export interface LibrarianReason {
  reason: string;
}

export interface BorrowAction {
  id: number;
  item: Item;
  client: Client;
  status: 'borrow_accepted' | 'borrow_declined' | 'return_accepted' | 'return_declined';
  actionDate: string;
  statusReason: string;
}


export interface ChatAPIResponse {
  message: {
    content: { text: string }[];
  };
}

export interface DaySummary {
  itemsBorrowed: number;
  itemsReturned: number;
  itemsAdded: number;
}

export interface PaginatedItems {
  content: Item[] | null;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface CreateItemRequest {
  title: string;
  author: string;
  yearPublished: string;
  itemType: string;
}