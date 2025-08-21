export const USE_SUPABASE = true; // Supabase aktivert - sørg for at SUPABASE_URL og SUPABASE_ANON_KEY er satt i Vercel
import { getSupabaseClient } from './supabaseClient.js';

const LOCAL_STORAGE_KEY = 'pengeplan_profile';

const DEFAULT_PROFILE = {
  id: 'local-demo',
  full_name: '', 
  email: '', 
  phone: '',
  address: { street:'', postal_code:'', city:'', municipality:'' },
  household: { size: 1, note: '' },
  role: 'user', 
  plan: 'free',
  notifications: { email:true, sms:false, weekly_tips:true, bill_reminder_days:3 },
  consents: { privacy:true, analytics:false, marketing:false, accepted_at: new Date().toISOString() },
  beta:false, 
  avatar:{ data_url:null, updated_at:null },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const db = {
  getProfile: async () => {
    if (USE_SUPABASE) {
      try {
        const supabase = await getSupabaseClient();
        if (!supabase) throw new Error('Supabase client not initialized');
        // For demo, we'll use a fixed ID or try to get the first profile
        // In a real app, this would be based on auth.uid()
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        if (error) throw error;
        return data[0] || DEFAULT_PROFILE;
      } catch (err) {
        console.error('Supabase getProfile error, falling back to localStorage:', err);
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 'null') || DEFAULT_PROFILE;
      }
    } else {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || 'null') || DEFAULT_PROFILE;
    }
  },
  
  setProfile: async (profile) => {
    profile.updated_at = new Date().toISOString();
    if (USE_SUPABASE) {
      try {
        const supabase = await getSupabaseClient();
        if (!supabase) throw new Error('Supabase client not initialized');
        // For demo, we'll upsert based on a fixed ID or try to match by email
        // In a real app, this would be based on auth.uid()
        const { data, error } = await supabase.from('profiles').upsert(profile, { onConflict: 'id' }).select();
        if (error) throw error;
        return data[0];
      } catch (err) {
        console.error('Supabase setProfile error, falling back to localStorage:', err);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
        return profile;
      }
    } else {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
      return profile;
    }
  },
  
  // Admin functions for user management
  getAllUsers: async () => {
    if (USE_SUPABASE) {
      try {
        const supabase = await getSupabaseClient();
        if (!supabase) throw new Error('Supabase client not initialized');
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.error('Supabase getAllUsers error, falling back to localStorage:', err);
        return JSON.parse(localStorage.getItem('pengeplan_users') || '[]');
      }
    } else {
      return JSON.parse(localStorage.getItem('pengeplan_users') || '[]');
    }
  },
  
  createUser: async (userData) => {
    if (USE_SUPABASE) {
      try {
        const supabase = await getSupabaseClient();
        if (!supabase) throw new Error('Supabase client not initialized');
        const { data, error } = await supabase.from('profiles').insert(userData).select();
        if (error) throw error;
        return data[0];
      } catch (err) {
        console.error('Supabase createUser error, falling back to localStorage:', err);
        const users = JSON.parse(localStorage.getItem('pengeplan_users') || '[]');
        const newUser = { ...userData, id: Date.now().toString() };
        users.push(newUser);
        localStorage.setItem('pengeplan_users', JSON.stringify(users));
        return newUser;
      }
    } else {
      const users = JSON.parse(localStorage.getItem('pengeplan_users') || '[]');
      const newUser = { ...userData, id: Date.now().toString() };
      users.push(newUser);
      localStorage.setItem('pengeplan_users', JSON.stringify(users));
      return newUser;
    }
  },
  
  updateUser: async (userId, userData) => {
    if (USE_SUPABASE) {
      try {
        const supabase = await getSupabaseClient();
        if (!supabase) throw new Error('Supabase client not initialized');
        const { data, error } = await supabase.from('profiles').update(userData).eq('id', userId).select();
        if (error) throw error;
        return data[0];
      } catch (err) {
        console.error('Supabase updateUser error, falling back to localStorage:', err);
        const users = JSON.parse(localStorage.getItem('pengeplan_users') || '[]');
        const index = users.findIndex(u => u.id === userId);
        if (index !== -1) {
          users[index] = { ...users[index], ...userData };
          localStorage.setItem('pengeplan_users', JSON.stringify(users));
          return users[index];
        }
        return null;
      }
    } else {
      const users = JSON.parse(localStorage.getItem('pengeplan_users') || '[]');
      const index = users.findIndex(u => u.id === userId);
      if (index !== -1) {
        users[index] = { ...users[index], ...userData };
        localStorage.setItem('pengeplan_users', JSON.stringify(users));
        return users[index];
      }
      return null;
    }
  },
  
  deleteUser: async (userId) => {
    if (USE_SUPABASE) {
      try {
        const supabase = await getSupabaseClient();
        if (!supabase) throw new Error('Supabase client not initialized');
        const { error } = await supabase.from('profiles').delete().eq('id', userId);
        if (error) throw error;
        return true;
      } catch (err) {
        console.error('Supabase deleteUser error, falling back to localStorage:', err);
        const users = JSON.parse(localStorage.getItem('pengeplan_users') || '[]');
        const filtered = users.filter(u => u.id !== userId);
        localStorage.setItem('pengeplan_users', JSON.stringify(filtered));
        return true;
      }
    } else {
      const users = JSON.parse(localStorage.getItem('pengeplan_users') || '[]');
      const filtered = users.filter(u => u.id !== userId);
      localStorage.setItem('pengeplan_users', JSON.stringify(filtered));
      return true;
    }
  },
  
  // Test-funksjon for å verifisere Supabase-tilkobling
  testConnection: async () => {
    if (!USE_SUPABASE) return { ok: false, message: 'USE_SUPABASE er false' };
    try {
      const supa = await getSupabaseClient();
      if (!supa) return { ok: false, message: 'Kunne ikke opprette Supabase-klient' };
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      if (error) return { ok: false, message: `Supabase-feil: ${error.message}` };
      return { ok: true, message: 'Supabase-tilkobling OK' };
    } catch (err) {
      return { ok: false, message: `Uventet feil: ${err.message}` };
    }
  }
};

