import React, { useEffect, useState, useRef } from "react";
import Chart from 'chart.js/auto';
import api_url from "@/lib/api_url";
import axios from "axios";
import ICurrency from "@/lib/interfaces/currency";
import ICurrencyHistory from "@/lib/interfaces/currencyHistory";
import { getCurrencyIdByName, getCurrencyNameById } from "@/lib/currency";
import { FaExchangeAlt } from "react-icons/fa";
import { getHours } from "@/lib/time";
import { regressionColor } from "@/lib/regression";

export default function ChartExample(props:any) {
  const [currencies, setCurrencies] = useState<ICurrency[]>([]);
  const [currencyHistory, setCurrencyHistory] = useState<ICurrencyHistory>();
  const [sellingCurrency, setSellingCurrency] = useState<ICurrency>({id: getCurrencyIdByName(currencies, 'PLN'), name: 'PLN'})
  const [buyingCurrency, setBuyingCurrency] = useState<ICurrency>({id: getCurrencyIdByName(currencies, 'USD'), name: 'USD'})
  const [pastTimestamp, setPastTimestamp] = useState('1d')
  const [trendlineEnabled, setTrendlineEnabled] = useState(false)

  useEffect(() => {
    const handleGetCurrencies = async () => {
      const { data } = await axios.get(api_url('currency'), {headers: {Accept: 'application/json'}})
      setCurrencies(data as ICurrency[])
    }
    props.setSellBuyCurrencies(sellingCurrency, buyingCurrency);
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
      let url = api_url('auth/currencyHistory') + '?timestamp=' + pastTimestamp + '&sell_currency_id=' + buyingCurrency.id + '&buy_currency_id=' + sellingCurrency.id
      if (trendlineEnabled) url += '&predict=true'
      const { data } = await axios.get(url, {headers: {Accept: 'application/json'}})
      setCurrencyHistory(data[0] as ICurrencyHistory)
    }
    if (sellingCurrency.id !== -1) {
      handleHistoryGet()
    }
    props.setSellBuyCurrencies(sellingCurrency, buyingCurrency);
  }, [sellingCurrency, buyingCurrency, pastTimestamp, trendlineEnabled])

  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null)

  function generateFutureData(): number[] {
    if (!currencyHistory || !currencyHistory.future) return [];
    const hours = getHours(pastTimestamp);
    let values: number[] = [];
    for (let i = 0; i < hours; i++) {
      values.push(currencyHistory.future.byx * (i) + currencyHistory.future.alfa);
      values.push(currencyHistory.future.byx * (i + 0.5) + currencyHistory.future.alfa);
    }
    return values;
  }
  
  useEffect(() => {
    if (currencyHistory && chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      let labels = currencyHistory.history
        .map((historyItem) =>
          new Date(historyItem.date).toLocaleString(undefined, {
            minute: "numeric",
            hour: "numeric",
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })
        )
      let values = currencyHistory.history.map((historyItem) => historyItem.conversion_value)
      labels = labels.reverse()
      values = values.reverse()
      const futureData = generateFutureData()
      const futureDataColor = currencyHistory.future ? regressionColor(currencyHistory.future.byx) : 'rgb(0,0,0)'
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Kurs",
              data: values,
              fill: false,
              borderColor: "rgb(188, 136, 252)",
              backgroundColor: "rgb(188, 136, 252)",
              pointStyle: false
            },
            {
              label: "Trend",
              data: futureData,
              fill: false,
              borderDash: [5, 5],
              borderWidth: 2,
              borderColor: futureDataColor,
              backgroundColor: "transparent",
              pointStyle: false,
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
                text: "",
                color: "rgb(188, 136, 252)",
                font: {
                  family: "monospace",
                  size: 20,
                  weight: "bold",
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
                text: "Kurs " + sellingCurrency.name + "/" + buyingCurrency.name,
                color: "rgb(188, 136, 252)",
                font: {
                  family: "monospace",
                  size: 20,
                  weight: "bold",
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
                text: "Para walutowa: " + sellingCurrency.name + "/" + buyingCurrency.name,
                color: "#fff",
                font: {
                  family: "monospace",
                  size: 20,
                  weight: "bold",
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
      <div className="bg-[#121212] borderLight p-4 m-2 bgGlass overflow-hidden text-white">
        <div className="aspect-w-16 aspect-h-9">
          <canvas
            ref={chartRef}
            className="w-full h-96 max-h-full #121212"
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center justify-center gap-x-4 my-2">

            <select className="bgdark border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="sell_currency"
              id="sell_currency"
              value={sellingCurrency.id} 
              onChange={(e) => {
                setSellingCurrency({id: parseInt(e.target.value), name: getCurrencyNameById(currencies, parseInt(e.target.value))})
              }}>
                {
                  currencies.map((curr) => {
                    if (curr.id !== -1) {
                      return (<option key={curr.id} value={curr.id}>{curr.name}</option>)
                    }
                  })
                }
            </select>
            <FaExchangeAlt onClick={() => {
              setSellingCurrency(buyingCurrency)
              setBuyingCurrency(sellingCurrency)
            }} />
            <select className="bgdark border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="buy_currency"
                id="buy_currency"
                value={buyingCurrency.id}
                onChange={(e) => {
                  setBuyingCurrency({id: parseInt(e.target.value), name: getCurrencyNameById(currencies, parseInt(e.target.value))})
              }}>
                {
                  currencies.map((curr) => {
                    return (<option key={curr.id} value={curr.id}>{curr.name}</option>)
                  })
                }
            </select>
          </div>
          <div className="p-2">Wybierz przedział czasu:</div>
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
              <option key={'3d'} value={'3d'}>3 dni</option>
              <option key={'6d'} value={'6d'}>7 dni</option>
          </select>
          <div className="p-2 flex flex-row gap-x-4">
            <span>Linia trendu</span>
            <input type="checkbox" checked={trendlineEnabled} onChange={(event) => {
              setTrendlineEnabled(event.target.checked)
            }} />
          </div>
          { currencyHistory && trendlineEnabled && currencyHistory.future &&
            <div>Dokładność linii trendu: {Math.abs(currencyHistory.future.correlation * 100.0).toFixed(2)}%</div>
          }
        </div>
      </div>
  );
}