import React from "react";

import '../app/globals.css';
import '../components/css/home.css';
import '../components/css/exchangeRates.css';
import '../components/css/post.css';
import { useExchangeRates } from '../components/functions/MoneyData';
import Layout from '@/app/layoutPattern';
export default function ExchangeRates() {
  const { currencies, date } = useExchangeRates();

  return (
    <Layout>
    <div className="containerCustom wrapper py1 borderLightY">
      <h1>Kursy walut</h1>
      
      <p className='textLeft'>Ostatnia aktualizacja: {date}</p> 
      
      <table className="table">

        <thead>
          <tr className="row Theader">
            <th className="cell">Waluta</th>
            {/* <th className="cell">Nazwa</th> */}
            <th className="cell">Kod waluty</th>
            <th className="cell">Kupno</th>
            <th className="cell">Sprzedaż</th>
          </tr>
        </thead>

        {currencies.length > 0 ? (
          <>
          	<tbody>{currencies.map((currency) => (
              <tr key={currency.currency} className='border-bottom'>
                {/* Render the currency data */}
                <td className="cell">{currency.currency}</td>
                {/* <td className="cell">{currency.name}</td>  */}
                <td className="cell">1 {currency.code}</td>
                <td className="cell">{currency.buy}</td>
                <td className="cell">{currency.sell}</td>
              </tr>     
            ))}</tbody>    
          </>
        ) : (
          // Render a loading state if currencies haven't been loaded yet
          <tbody><tr><th colSpan={5}>Loading...</th></tr></tbody>
        )}
        
      </table>   
      
    </div>   
    </Layout>     
  );
}
module.exports