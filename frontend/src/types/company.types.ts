export interface Company {
  id: string;
  name: string;
  logo_url?: string | null;
  website_url?: string | null;
  display_order: number;
  is_visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CompanyUpsertDTO {
  name: string;
  logo_url?: string | null;
  website_url?: string | null;
  display_order?: number;
  is_visible?: boolean;
}
