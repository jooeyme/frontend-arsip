// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProfile } from '../modules/fetch/user'; // endpoint `/auth/me`
import axios from 'axios';
import { Navigate, replace, useNavigate } from 'react-router-dom';

const AuthContext = createContext();

/**
 * AuthProvider harus membungkus seluruh aplikasi (di index.js / App.jsx),
 * agar semua komponen bisa mengakses `useAuth()`.
 */
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Panggil API /auth/me untuk ambil data user
  useEffect(() => {
    const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return navigate('/signin', { replace: true });
      }


    (async () => {
      try {
        const res = await getProfile();
        setUser(res.data);            // misal { id, username, name, ... }
      } catch (err) {
        console.warn('Not authenticated');
        setUser(null);
        navigate('/signin', { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook untuk mengkonsumsi AuthContext.
 * Pastikan dipanggil hanya di dalam <AuthProvider>
 */
function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return ctx; // { user, loading }
}

export { AuthProvider, useAuth };