import { supabase } from '../lib/supabase'
import { createSupabaseNutAccessService } from './supabaseNutAccessCore'

export const supabaseNutAccessService = createSupabaseNutAccessService((name, options) => supabase.functions.invoke(name, options))
