// pages/deposit.tsx
'use client'
import { useState } from 'react';
import { db } from '@/functions/firebase';
import {setDoc, doc, addDoc, collection} from "firebase/firestore"

const DepositPage = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState("0");
  const [daily, setDaily] = useState("0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tot = parseInt(daily) * 70;
    // Firebase or backend logic to store the deposit information
    await addDoc(collection(db, "plans"), {
        name,
        price: parseInt(price),
        daily: parseInt(daily),
        total: tot,
    })

    // Reset form fields
    setName('');
    setPrice("0");
    setDaily("0");
  };

  return (
    <div>
      <h1>Add plan</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Daily"
          value={daily}
          onChange={(e) => setDaily(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default DepositPage;
