export interface Event {
  event_id: number;
  category_name?: string;
  event_name: string; // Nama acara
  event_image: string; // URL gambar acara
  event_description: string; // Deskripsi acara
  event_price: number; // Harga acara
  event_location: string; // Lokasi acara
  event_capacity: number; // Kapasitas acara
  categoryId: number; // ID kategori
  event_start_date: Date | string; // Tanggal dan waktu mulai acara
  event_end_date: Date | string; // Tanggal dan waktu selesai acara
  discounted_price?: number; // Harga diskon (opsional)
  is_online: boolean; // Apakah acara ini online
  is_paid: boolean; // Apakah acara ini bayar atau gratis
  event_status?: "Ongoing" | "Completed"; // Status acara (opsional)
}

export interface CreateEvent {
  event_name: string; // Nama acara
  event_image: string; // URL gambar acara
  event_description: string; // Deskripsi acara
  event_price: number; // Harga acara
  event_location: string; // Lokasi acara
  event_capacity: number; // Kapasitas acara
  categoryId: number; // ID kategori
  event_start_date: string; // Tanggal dan waktu mulai acara
  event_end_date: string; // Tanggal dan waktu selesai acara
  is_online: string | boolean; // Apakah acara ini online
  is_paid: string | boolean; // Apakah acara ini bayar atau gratis
  discount_percentage: number; // Persentase diskon
  is_active: string | boolean; // Status aktif diskon
}

export interface UpdateEvent {
  event_name: string; // Nama acara
  event_image: string; // URL gambar acara
  event_description: string; // Deskripsi acara
  event_price: number; // Harga acara
  event_location: string; // Lokasi acara
  event_capacity: number; // Kapasitas acara
  categoryId: number; // ID kategori
  event_start_date: string; // Tanggal dan waktu mulai acara
  event_end_date: string; // Tanggal dan waktu selesai acara
  is_online: string | boolean; // Apakah acara ini online
  is_paid: string | boolean; // Apakah acara ini bayar atau gratis
  discount_percentage: number; // Persentase diskon
  is_active: string | boolean; // Status aktif diskon
  discountId: number; // ID diskon (opsional)
}

export interface Discount {
  eventId: number; // ID acara yang terkait
  discount_percentage: number; // Persentase diskon
  is_active: boolean; // Status aktif diskon
  end_date: Date; // Tanggal berakhir diskon
}

export interface Category {
  category_name: string; // Nama kategori
  category_description: string; // Deskripsi kategori
}
