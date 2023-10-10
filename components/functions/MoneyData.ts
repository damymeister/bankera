"use client"
import { useState, useEffect } from 'react';

interface Data {
  currency: string,
  name: string,
  code: string,
  buy: string,
  sell: string
}

export function useExchangeRates() {
  const [currencies, setCurrencies] = useState<Data[]>([]);
  const [date, setDate] = useState('');

  useEffect(() => {
    fetch('https://api.frankfurter.app/latest?from=PLN')
      .then(response => response.json())
      .then(data => {
        console.log("Received data:", data);
        const newCurrencies = Object.entries(data.rates).map(([code, rate]) => ({
          currency: `PLN ${code}`,
          name: '', 
          code,
          buy: ((rate as number) * 0.98).toFixed(4), 
          sell: ((rate as number) * 1.02).toFixed(4) 
        }));
        setCurrencies(newCurrencies);
        setDate(data.date); // Extracting and setting the date
      })
      .catch(error => console.error(error));
  }, []);

  return { currencies, date };
}