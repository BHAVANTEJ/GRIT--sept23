import { supabase } from '../lib/supabase';
import { Company, CompanyUpsertDTO } from '../types/company.types';
import { FALLBACK_COMPANIES } from '../data/companies';

/**
 * Company display data.
 *
 * Reads the Supabase `companies` table so the admin dashboard can manage the
 * list, and falls back to `data/companies.ts` when the table does not exist yet
 * or is empty. Either way the marquee component never contains the data itself.
 */
export const companyService = {
  getVisibleCompanies: async (): Promise<Company[]> => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        if (error && import.meta.env.DEV) {
          console.warn('[companies] falling back to local data:', error.message);
        }
        return FALLBACK_COMPANIES;
      }
      return data as Company[];
    } catch {
      return FALLBACK_COMPANIES;
    }
  },

  /** Admin view: includes hidden rows. */
  getAllCompanies: async (): Promise<Company[]> => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return (data ?? []) as Company[];
  },

  upsertCompany: async (company: CompanyUpsertDTO & { id?: string }): Promise<Company> => {
    const { data, error } = await supabase
      .from('companies')
      .upsert(company)
      .select()
      .single();

    if (error) throw error;
    return data as Company;
  },

  setVisibility: async (id: string, isVisible: boolean): Promise<void> => {
    const { error } = await supabase
      .from('companies')
      .update({ is_visible: isVisible })
      .eq('id', id);

    if (error) throw error;
  },
};
