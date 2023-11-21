import React, { useEffect, useState } from "react";
import '../app/globals.css';
import '../components/css/home.css';
import '../components/css/exchangeRates.css';
import '../components/css/post.css';
import Layout from '@/app/layoutPattern';
import axios from "axios";
import api_url from "@/lib/api_url";
import { getCurrencyIdByName, getCurrencyNameById, inZeroRange, significantDigits } from "@/lib/currency";
import { FaExchangeAlt } from "react-icons/fa";
import ICurrency from "@/lib/interfaces/currency";
import ICurrencyHistory from "@/lib/interfaces/currencyHistory";

export default function ExchangeRates() {
  //const { currencies, date } = useExchangeRates();
  const allSelector: ICurrency = {id: -1, name: 'Wszystkie'}
  const [currencies, setCurrencies] = useState<ICurrency[]>([])
  const [currencyHistory, setCurrencyHistory] = useState<ICurrencyHistory[]>([])
  const [sellingCurrency, setSellingCurrency] = useState<ICurrency>(allSelector)
  const [buyingCurrency, setBuyingCurrency] = useState<ICurrency>(allSelector)
  const [pastTimestamp, setPastTimestamp] = useState('2h')

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
      let url = api_url('auth/currencyHistory') + '?timestamp=' + pastTimestamp + '&includeDiff=true&invert=true&sell_currency_id=' + sellingCurrency.id.toString()
      if (buyingCurrency.id !== -1) url += '&buy_currency_id=' + buyingCurrency.id.toString()
      const { data } = await axios.get(url, {headers: {Accept: 'application/json'}})
      console.log(data)
      setCurrencyHistory(data as ICurrencyHistory[])
    }
    if (sellingCurrency.id !== -1) {
      handleHistoryGet()
    }
  }, [buyingCurrency, sellingCurrency, pastTimestamp])

  const formatDiff = (value: number | undefined) => {
    if (value === undefined) return <span></span>
    if (inZeroRange(value)) return <span className="text-gray-400 text-xs self-start">0.00</span>
    if (value > 0) return <span className="text-green-400 text-xs self-start">{'+' + value.toFixed(significantDigits(value))}</span>
    return <span className="text-red-500 text-xs self-start">{value.toFixed(significantDigits(value))}</span>
  }

  return (
    <Layout>
      <div className="containerCustom wrapper borderLightY min-w-full px-4 py-1">
        <h1 className="text-2xl my-4">Kursy walut</h1>
        <div className="flex flex-row items-center justify-center gap-x-4 my-2">
          <span>Porównaj: </span>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
          <FaExchangeAlt />
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
        <div className="flex flex-row items-center justify-center gap-x-4 my-2">
          <span>Porównaj z kursem sprzed: </span>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          name="timestamp"
          id="timestamp"
          value={pastTimestamp}
          onChange={(e) => {
            setPastTimestamp(e.target.value)
          }}>
            <option key={'1h'} value={'2h'}>1 godziny</option>
            <option key={'3h'} value={'4h'}>3 godzin</option>
            <option key={'6h'} value={'7h'}>6 godzin</option>
            <option key={'12h'} value={'13h'}>12 godzin</option>
            <option key={'1d'} value={'1d'}>1 dnia</option>
          </select>
        </div>
        <div className='textLeft'>Ostatnia aktualizacja: {currencyHistory.length > 0 ? new Date(currencyHistory[0].history[0].date).toLocaleString() : '-'}</div> 
        <table className="table">
          <thead>
            <tr className="row Theader">
              <th className="cell">Para walutowa</th>
              <th className="cell">Kupno</th>
              <th className="cell">Sprzedaż</th>
            </tr>
          </thead>

          {currencyHistory.length > 0 ? (
            <>
              <tbody>{currencyHistory.map((pair) => (
                <tr key={pair.buy_currency_id.toString() + '-' + pair.sell_currency_id.toString()} className='border-bottom'>
                  <td className="cell">
                    <div className="flex flex-row items-center justify-center gap-x-2">
                      <span>{getCurrencyNameById(currencies, pair.sell_currency_id)}</span>
                      <FaExchangeAlt />
                      <span>{getCurrencyNameById(currencies, pair.buy_currency_id)}</span>
                    </div>
                  </td>
                  <td className="cell">
                    <div className="flex flex-row items-center gap-x-1">
                      <span>{pair.history[0].invertedConversion &&
                        pair.history[0].invertedConversion.toFixed(significantDigits(pair.history[0].invertedConversion))
                      }</span>
                      {formatDiff(pair.invertedDiffTotal)}
                    </div>
                  </td>
                  <td className="cell">
                    <div className="flex flex-row items-center gap-x-1">
                      <span>{pair.history[0].conversion_value.toFixed(significantDigits(pair.history[0].conversion_value))}</span>
                      {formatDiff(pair.diffTotal)}
                    </div>
                  </td>
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