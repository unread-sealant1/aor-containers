import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables');
}

// Client for public/authenticated user requests
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for administrative/backend requests (bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || supabaseAnonKey);

/**
 * Storage Service for Container Images
 */
export const storageService = {
  async uploadImage(bucket: string, filePath: string, fileBody: Buffer, contentType: string) {
    const fileName = `${Date.now()}_${filePath}`;
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, fileBody, {
        contentType,
        upsert: true,
      });

    if (error) throw error;
    return data.path;
  },

  async getPublicUrl(bucket: string, path: string) {
    const { data } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(path);
    return data.publicUrl;
  },

  async deleteImage(bucket: string, path: string) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    return data;
  }
};
