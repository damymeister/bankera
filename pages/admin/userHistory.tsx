import '@/components/css/home.css';
import '@/components/css/contact.css';
import '@/components/css/post.css';
import '@/app/globals.css';
import Layout from '@/app/layoutPattern';
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaCoins, FaExchangeAlt, FaFolderOpen, FaHandsHelping, FaHistory, FaHome, FaUser } from 'react-icons/fa';
import Link from 'next/link';
import axios from 'axios';
import api_url from '@/lib/api_url';
import { getCurrencies } from '../api/services/currencyService';
import { getCurrenciesPairs } from '../api/services/currencyPairs';
import ICurrency from '@/lib/interfaces/currency';
import ICurrencyPair from '@/lib/interfaces/currencyPair';
import { IRegisteringUser } from '@/lib/interfaces/user';
import { ITransactionData } from '@/lib/interfaces/adminPanel';

export default function History() {
    
    const [currenciesNames, setCurrenciesNames] = useState<ICurrency[]>([]);
    const [currenciesPairId, setcurrenciesPairId] = useState<ICurrencyPair[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingCurr, setisLoadingCurr] = useState<boolean>(true);
    const [userData, setUserData] = useState<IRegisteringUser>({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone_number: "",
    });
    const [transactions, setTransactions] = useState<ITransactionData>({
        innerTransactions: [],
        userToUserTransactions: []
      });
    
    
      useEffect(() => {
        const fetchData = async () => {
          try {
            const urlParams = new URLSearchParams(window.location.search);
            const id = urlParams.get('id');
            
            const urlWithQuery = api_url(`auth/admin/transactionHistory?id=${id}`);
            const res = await axios.get(urlWithQuery, { headers: { Accept: 'application/json' } });
            
            const userDataUrl = api_url(`auth/admin/manageUser?id=${id}`);
            const userRes = await axios.get(userDataUrl, { headers: { Accept: 'application/json' } });
            
            setUserData(userRes.data);
            setTransactions(res.data);
            // console.log(res.data); // Log the fetched data
            // console.log(userRes.data); // Log the fetched data
            
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setIsLoading(false); 
          }
        };

        const getCurrencyData = async () => {
          try {
            const currenciesPairs = await getCurrenciesPairs();
            if (currenciesPairs && Array.isArray(currenciesPairs)) {
              setcurrenciesPairId(currenciesPairs);
            } else {
              console.error('Invalid currencies pairs data');
            }
            const currencies = await getCurrencies();
            if (currencies && Array.isArray(currencies)) {
              setCurrenciesNames(currencies);
            } else {
              console.error('Invalid currencies data');
            }
          } catch (error) {
            console.error('Error fetching currency data:', error);
  
          } finally {
            setisLoadingCurr(false);
          }
        }
            fetchData();
            getCurrencyData();

      }, []);

      function getCurrencyPairNames(currencyPairId: number): { sellCurrencyName: string, buyCurrencyName: string } {
        const sellCurrencyId = Array.isArray(currenciesPairId) && currenciesPairId.find(pair => pair.id === currencyPairId)?.sell_currency_id;
        const buyCurrencyId = Array.isArray(currenciesPairId) && currenciesPairId.find(pair => pair.id === currencyPairId)?.buy_currency_id;
        const sellCurrencyName = currenciesNames.find(currency => currency.id === sellCurrencyId)?.name;
        const buyCurrencyName = currenciesNames.find(currency => currency.id === buyCurrencyId)?.name;
      
        return { sellCurrencyName: sellCurrencyName || '', buyCurrencyName: buyCurrencyName || '' };
      };
      
    return (
    <Layout>
      <div className="containerCustom borderLightY">
        <div className="my-1">
        
          <div className="relative px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:rounded-lg sm:px-10 ">
              <div className='textUnderline mb-2'>
                <div className='text-[#BB86FC] flex flex-row items-center textleft  hover:text-[#9073ff] mx-3'> <FaHome/> - <Link href={`/admin/adminPanel`} className="">Powrót</Link></div>
                <h1 className='text-3xl'> Historia transakcji: {userData.first_name} {userData.last_name}</h1>
              </div>
            
            <div className="mx-auto bgGlass">
              {(isLoading && isLoadingCurr) ? (
                <p>Loading...</p>
              ) : (
                
                Array.isArray(transactions.innerTransactions) && transactions.innerTransactions.length > 0 ? (
                  <div className='flex flex-col'>
                  <h1 className='m-5 text-3xl'>Wymiany walut</h1>
                  <table className="w-10/12 mx-auto border-collapse border-b-1 border-gray-300">
                    <thead>
                      <tr className='border-b border-gray-300 '>
                        <th className="">Numer transakcji</th>
                        <th className=""> Data wykonania</th>
                        <th className=""> Wartość</th>
                        <th className=""> Wymieniono na</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.innerTransactions.map((transaction) => {
                        const sellCurrencyName = getCurrencyPairNames(transaction.currency_pair_id).sellCurrencyName;
                        const buyCurrencyName = getCurrencyPairNames(transaction.currency_pair_id).buyCurrencyName;

                        return (
                          <tr className='border-b border-gray-700 hover:bg-gray-700 text-center items-center' key={transaction.id}>
                            <td className="py-1">{transaction.id}</td>
                            <td className="py-1">{new Date(transaction.transaction_date).toLocaleString()}</td>
                            <td className="py-1">{transaction.inital_amount} {sellCurrencyName}</td>
                            <td className="py-1">{transaction.converted_amount} {buyCurrencyName}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <h1 className='m-5 text-3xl'>Wymiany z użytkownikami</h1>
                  <table className="w-10/12 mx-auto border-collapse border-b-1 border-gray-300">
                    <thead>
                      <tr className='border-b border-gray-300'>
                        <th className="">Numer transakcji</th>
                        <th className=""> Z użytkownikiem</th>
                        <th className=""> Data wykonania</th>
                        <th className=""> Wymieniono</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.userToUserTransactions.map((transactionWithUser) => {
                        const sellCurrencyName = getCurrencyPairNames(transactionWithUser.currency_pair_id).sellCurrencyName;
                        const buyCurrencyName = getCurrencyPairNames(transactionWithUser.currency_pair_id).buyCurrencyName;

                        return (
                          <tr className='border-b border-gray-700 hover:bg-gray-700 text-center items-center' key={transactionWithUser.id}>
                            <td className="py-1">{transactionWithUser.id}</td>
                            <td className="py-1">{transactionWithUser.wallet_recipient_id}</td>
                            <td className="py-1">{new Date(transactionWithUser.transaction_date).toLocaleString()}</td>
                            <td className="py-1">{transactionWithUser.inital_amount} {sellCurrencyName} na {transactionWithUser.converted_amount} {buyCurrencyName}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  </div>
                ) : (
                  <p>No transactions found.</p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
            
  )
}
