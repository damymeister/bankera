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
  const [pastTimestamp, setPastTimestamp] = useState('6h')

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
    }
  }, [currencies])

  useEffect(() => {
    const handleHistoryGet = async () => {
      let url = api_url('auth/currencyHistory') + '?timestamp=' + pastTimestamp + '&sell_currency_id=' + "118" + '&buy_currency_id=' + "150"
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

  useEffect(() => {
  if (currencyHistory.length > 0 && chartRef.current) {
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
    new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Currency Value",
            data: data,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Date",
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Currency Value",
            },
            ticks: {
              precision: 8, // Set the number of decimal places for the Y-axis values
            },
          },
        },
      },
    });
  }
}, [currencyHistory]);

  return (
    <div >
      <canvas ref={chartRef} width="1820" height="800"></canvas>
    </div>
  );
}