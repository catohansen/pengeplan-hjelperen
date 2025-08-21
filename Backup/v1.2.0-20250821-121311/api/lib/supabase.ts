import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
          preferences: Json;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
          preferences?: Json;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
          preferences?: Json;
        };
      };
      budgets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          spent: number;
          category: string;
          period: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          amount: number;
          spent?: number;
          category: string;
          period: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          amount?: number;
          spent?: number;
          category?: string;
          period?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          description: string;
          category: string;
          type: 'income' | 'expense';
          date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          description: string;
          category: string;
          type: 'income' | 'expense';
          date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          description?: string;
          category?: string;
          type?: 'income' | 'expense';
          date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      debts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          interest_rate: number;
          minimum_payment: number;
          due_date: string;
          status: 'active' | 'paid' | 'defaulted';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          amount: number;
          interest_rate: number;
          minimum_payment: number;
          due_date: string;
          status?: 'active' | 'paid' | 'defaulted';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          amount?: number;
          interest_rate?: number;
          minimum_payment?: number;
          due_date?: string;
          status?: 'active' | 'paid' | 'defaulted';
          created_at?: string;
          updated_at?: string;
        };
      };
      bills: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          amount: number;
          due_date: string;
          status: 'pending' | 'paid' | 'overdue';
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          amount: number;
          due_date: string;
          status?: 'pending' | 'paid' | 'overdue';
          category: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          amount?: number;
          due_date?: string;
          status?: 'pending' | 'paid' | 'overdue';
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      support_schemes: {
        Row: {
          id: string;
          name: string;
          description: string;
          eligibility_criteria: string;
          application_url: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          eligibility_criteria: string;
          application_url: string;
          category: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          eligibility_criteria?: string;
          application_url?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
