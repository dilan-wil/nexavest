"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/functions/firebase";
// import { IncomeType } from "@/lib/definitions";


const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);  // Initialize totalIncome
  const [transactions, setTransactions] = useState([]);  // Initialize totalIncome
  const [referrals, setReferrals] = useState(null);  // Initialize totalIncome

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, userInfo, transactions, referrals, setUserInfo, setTransactions, setReferrals }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
