
export interface User {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
}

export interface SavedTrip {
  id: string;
  user_id: string;
  trip_data: any;
  created_at: string;
  updated_at: string;
}
