import React from 'react';
import { Line } from 'react-chartjs-2';
import { useExchangeRates } from './functions/MoneyData';

function ExchangeRateChart() {
  const { currencies } = useExchangeRates();

  return (
    <div>
      <h2>Exchange Rate Charts</h2>
      {currencies.map((currency) => (
        <div key={currency.currency} style={{ width: '50%', margin: '0 auto' }}>
          <h3>{currency.currency}</h3>
          <Line
            data={{
              labels: ['Buy', 'Sell'],
              datasets: [
                {
                  label: 'Buy',
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,192,192,1)',
                  borderWidth: 1,
                  hoverBackgroundColor: 'rgba(75,192,192,0.8)',
                  hoverBorderColor:'rgba(75,192,192 ,1)' ,
                   data:[currency.buy]
                },
                {
                 label :'Sell',
                 backgroundColor:'#FF6384' ,
                 borderColor :'#FF6384',
                 borderWidth :1,
                 hoverBackgroundColor :'#FF6384',
                 hoverBorderColor : '#FF6384' ,
                    data:[ currency.sell] 
               }
             ]
           }}
         />
       </div>
     ))}
   </div>
 );
}

export default ExchangeRateChart;