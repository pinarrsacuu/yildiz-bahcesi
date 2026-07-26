export type EventType =
  | "dogum_gunu"
  | "nisan"
  | "dugun"
  | "baby_shower"
  | "soz"
  | "diger";

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  dogum_gunu: "Doğum Günü",
  nisan: "Nişan",
  dugun: "Düğün",
  baby_shower: "Baby Shower",
  soz: "Söz",
  diger: "Diğer",
};

export type AppointmentStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "completed";

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Beklemede",
  approved: "Onaylandı",
  rejected: "Reddedildi",
  completed: "Tamamlandı",
};

export interface AppointmentRequest {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  event_type: EventType;
  guest_count: number;
  requested_date: string;
  alternate_date: string | null;
  message: string | null;
  status: AppointmentStatus;
  staff_note: string | null;
  access_token: string;
  created_at: string;
  updated_at: string;
}

export interface Package {
  id: string;
  category: "menu" | "paket";
  title: string;
  description: string;
  price_info: string | null;
  images: string[];
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VenueEvent {
  id: string;
  appointment_request_id: string | null;
  customer_name: string;
  event_type: EventType;
  event_date: string;
  qr_token: string;
  qr_image_path: string | null;
  photos_expire_at: string | null;
  created_by: string | null;
  created_at: string;
}

export interface EventPhoto {
  id: string;
  event_id: string;
  storage_path: string;
  thumbnail_path: string | null;
  uploaded_by: string | null;
  uploaded_at: string;
  caption: string | null;
}
