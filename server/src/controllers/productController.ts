import express from 'express';
import type { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import type { Product } from '../models/Product';
import { PostgrestError } from '@supabase/supabase-js';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('active', true);

    if (error) throw error;

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', req.params.slug)
      .eq('active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      throw error;
    }

    res.json({ success: true, data });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData: Product = req.body;
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ success: true, data });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
