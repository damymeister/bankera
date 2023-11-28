import React, { useEffect, useState, useRef } from "react";
import Chart from 'chart.js/auto';
import api_url from "@/lib/api_url";
import axios from "axios";
import ICurrency from "@/lib/interfaces/currency";
import ICurrencyHistory from "@/lib/interfaces/currencyHistory";
import { getCurrencyIdByName } from "@/lib/currency";

export default function ChartExample() {
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const allSelector: ICurrency = {id: -1, name: 'Wszystkie'}
  const [currencyHistory, setCurrencyHistory] = useState<ICurrencyHistory[]>([]);
  const [sellingCurrency, setSellingCurrency] = useState<ICurrency>(allSelector)
  const [buyingCurrency, setBuyingCurrency] = useState<ICurrency>(allSelector)
  const [pastTimestamp, setPastTimestamp] = useState('1d')

  useEffect(() => {
    const handleGetCurrencies = async () => {
      const { data } = await axios.get(api_url('currency'), {headers: {Accept: 'application/json'}})
      setCurrencies([allSelector, ...data] as ICurrency[])
    }
    
    handleGetCurrencies()
  }, [])

  useEffect(() => {
    if (currencies.length > 0) {
      setSellingCurrency({id: getCurrencyIdByName(currencies, 'PLN'), name: 'PLN'})
      setBuyingCurrency({id: getCurrencyIdByName(currencies, 'USD'), name: 'USD'})
    }
  }, [currencies])

  useEffect(() => {
    const handleHistoryGet = async () => {
      let url = api_url('auth/currencyHistory') + '?timestamp=' + pastTimestamp + '&sell_currency_id=' + sellingCurrency.id + '&buy_currency_id=' + buyingCurrency.id

      // if (buyingCurrency.id !== -1) {
      //   url += '&buy_currency_id=' + "150"
      // }
      const { data } = await axios.get(url, {headers: {Accept: 'application/json'}})
      console.log(data)
      setCurrencyHistory(data as ICurrencyHistory[])
    }
    if (sellingCurrency.id !== -1) {
      handleHistoryGet()
    }
   
  }, [sellingCurrency, buyingCurrency, pastTimestamp])

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (currencyHistory.length > 0 && chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      const labels = currencyHistory.map((currency) =>
        currency.history.reverse().map((historyItem) =>
          new Date(historyItem.date).toLocaleString(undefined, {
            minute: "numeric",
            hour: "numeric",
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })
        )
      ).flat();
      const data = currencyHistory.map((currency) =>
        currency.history.reverse().map((historyItem) => historyItem.conversion_value)
      ).flat();
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Kurs",
              data: data,
              fill: false,
              borderColor: "rgb(188, 136, 252)",
              backgroundColor: "rgb(188, 136, 252)",
            },
          ],
        },
        options: {
          maintainAspectRatio: true,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Data",
                color:"rgb(188, 136, 252)",
                font: {
                  family: 'monospace',
                  size: 20,
                  weight: 'bold',
                  lineHeight: 1.2,
                },
              },
              grid: {
                color: "#6d9ff646", // Change the color of the x-axis mesh here
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "Kurs "+ sellingCurrency.name + '/' + buyingCurrency.name,
                color:"rgb(188, 136, 252)",
                font: {
                  family: 'monospace',
                  size: 20,
                  weight: 'bold',
                  lineHeight: 1.2,
                },
              },
              ticks: {
                precision: 8,
              },
              grid: {
                color: "#6d9ff646",
              },
            },
          },
          animation: {
            duration: 2000, 
          },
          interaction: {
            intersect: false,
          },
          plugins: {
            legend: {
              title: {
                display: true,
                text: 'Wykres dla: ' + sellingCurrency.name + '/' + buyingCurrency.name,
                color: '#fff',
                font: {
                  family: 'monospace',
                  size: 20,
                  weight: 'bold',
                  lineHeight: 1.2,
                },
              },
              labels: {
                color: "rgb(188, 136, 252)",
              },
            },
          },
          elements: {
            point: {
              backgroundColor: "rgb(188, 136, 252)",
              borderColor: "rgb(188, 136, 252)",
            },
          },
          // backgroundColor: "#bb86fc8a", 
        },
      });
    }
  }, [currencyHistory]);

  return (
      <div className="bg-[#121212] borderLight p-4 m-2 bgGlass overflow-hidden">
        <div className="aspect-w-16 aspect-h-9">
          <canvas
            ref={chartRef}
            className="w-full h-96 max-h-full #121212"
          />
        </div>
        <div className="flex flex-row items-center">
          <div className="pr-4">Wybierz okres czasu:</div>
          <select className="bgdark border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="timestamp"
            id="timestamp"
            value={pastTimestamp}
            onChange={(e) => {
              setPastTimestamp(e.target.value)
            }}>
              <option key={'3h'} value={'3h'}>3 godzin</option>
              <option key={'6h'} value={'6h'}>6 godzin</option>
              <option key={'12h'} value={'12h'}>12 godzin</option>
              <option key={'1d'} value={'1d'}>1 dzień</option>
              <option key={'6d'} value={'6d'}>7 dzień</option>
          </select>
        </div>
      </div>
  );
}