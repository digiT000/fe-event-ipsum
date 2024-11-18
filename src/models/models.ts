export interface LoginAuth {
  email: string;
  password: string;
}

export interface UserProps {
  name: string;
  userReferralId: number;
  referral_use: string | null;
  points: number;
  user_role: string;
  refresh_token: string;
}

export interface CategoryProps {
  category_id: number; // ID kategori
  category_name: string; // Nama kategori
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role?: "user";
}

export enum UniqueCode {
  USER = "ussr",
  ADMIN = "ussad",
}

export interface EventCardProps {
  event_id: number | string;
  event_name: string; // Nama acara
  event_image: string; // URL gambar acara
  event_price: number; // Harga acara
  event_capacity: number; // Kapasitas acara
  category_name: string;
  event_start_date: string; // Tanggal dan waktu mulai acara
  event_end_date: string; // Tanggal dan waktu selesai acara
  discounted_price?: number; // Harga diskon (opsional)
  is_online: boolean; // Apakah acara ini online
  is_paid: boolean; // Apakah acara ini bayar atau gratis
  event_description: string;
  event_location: string;
  onClick?: () => void;
}

export interface BookingData {
  user_id?: number;
  event_id: number;
  usePoint: number;
  payment_method: PaymentMethod;
  is_paid: boolean;
}

export enum PaymentMethod {
  QRIS = "QRIS",
  BankBCA = "Bank BCA",
  BCAVirtualAccount = "BCA Virtual Account",
}

export enum BookingServiceCode {
  TransactionAvailable = "TA",
  BookingCreated = "BC",
  NAQuoata = "NAQ",
  RegistarationClose = "RC",
  WaitingForPayment = "WFP",
  NoTransactionFound = "NOF",
  UpdateToPaid = "UP",
  UpdateToCanceled = "UC",
  Unauthorized = "UT",
}

export enum BookingStatus {
  Canceled = "Canceled",
  WaitingForPayment = "Waiting Payment",
  Paid = "Paid",
  Completed = "Completed",
}
export interface TransactionPageProps {
  transaction_id: number;
  event_image: string; // URL gambar acara
  event_name: string; // Nama acara
  category_name: string;
  event_start_date: string; // Tanggal dan waktu mulai acara
  event_end_date: string; // Tanggal dan waktu selesai acara
  is_online: boolean; // Apakah acara ini online
  event_description: string;
  payment_ammount: number | 0;
  order_date: string;
  status_order: string;
  event_location: string;
  payment_method: string;
}

export interface ReviewData {
  transaction_id: number;
  eventId: number;
  review_content: string;
  review_rating: number;
  isAttend: boolean;
}
