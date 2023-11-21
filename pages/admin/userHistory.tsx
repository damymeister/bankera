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
import { IRegisteringUser, IUserSearch } from '@/lib/interfaces/user';
import { ITransactionData } from '@/lib/interfaces/adminPanel';
import { pageEndIndex, pageStartIndex } from '@/lib/pages';
import Paginator from '@/components/paginator';
import { significantDigits } from '@/lib/currency';

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
    const [recipientData, setRecipientData] = useState<IUserSearch[]>([]);    
    const [transactions, setTransactions] = useState<ITransactionData>({
        innerTransactions: [],
        userToUserTransactions: []
      });

    // PAGINATION states
    const [iTrnsPage, setITrnsPage] = useState(0)
    const [iTrnsTotalPages, setITrnsTotalPages] = useState(0)
    const [uuTrnsPage, setUUTrnsPage] = useState(0)
    const [uuTrnsTotalPages, setUUTrnsTotalPages] = useState(0)
    const recordsPerPage = 10

    useEffect(() => {
      if (transactions.innerTransactions.length > 0) {
        setITrnsPage(1)
        setITrnsTotalPages(Math.ceil(transactions.innerTransactions.length / recordsPerPage))
      }
      if (transactions.userToUserTransactions.length > 0) {
        setUUTrnsPage(1)
        setUUTrnsTotalPages(Math.ceil(transactions.userToUserTransactions.length / recordsPerPage))
      }
    }, [transactions])

    useEffect(() => {
      const fetchData = async () => {
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const id = urlParams.get('id');
          const urlWithQuery = api_url(`auth/admin/transactionHistory?id=${id}`);
          const res = await axios.get(urlWithQuery, { headers: { Accept: 'application/json' } });
          const userDataUrl = api_url(`auth/admin/manageUser?id=${id}`);
          const userRes = await axios.get(userDataUrl, { headers: { Accept: 'application/json' } });
          const recipientDataUrl = api_url(`auth/admin/user`);
          const recipientRes = await axios.get(recipientDataUrl, { headers: { Accept: 'application/json' } });
          setUserData(userRes.data);
          setTransactions(res.data);
          setRecipientData(recipientRes.data);
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

    const findCurrencyName = (currencyId : number) =>{
      var currencyname = null;
      currenciesNames.forEach(currency => {
          if(currencyId == currency.id){
              currencyname = currency.name;
          }
      });
      return currencyname;
    }

    const findUser = (wallet_id: number): string | null => {
      if (recipientData) {
        const user = recipientData.find((user) => user.wallet_id === wallet_id);
        if (user) {
          return user.first_name + " " + user.last_name;
        }
      }
      return null;
    };

    const generateInnerTransactions = () => {
      let rows: JSX.Element[] = []
      if (iTrnsPage === 0) return rows
      for (let i = pageStartIndex(recordsPerPage, iTrnsPage);
        i < pageEndIndex(recordsPerPage, iTrnsPage, iTrnsTotalPages, transactions.innerTransactions.length); i++) {
        const transaction = transactions.innerTransactions[i]
        const sellCurrencyName = getCurrencyPairNames(transaction.currency_pair_id).sellCurrencyName;
        const buyCurrencyName = getCurrencyPairNames(transaction.currency_pair_id).buyCurrencyName;
        rows.push(
          <tr className='border-b border-gray-700 hover:bg-gray-700 text-center items-center' key={transaction.id}>
            <td className="py-1">{transaction.id}</td>
            <td className="py-1">{new Date(transaction.transaction_date).toLocaleString()}</td>
            <td className="py-1">{transaction.inital_amount.toFixed(significantDigits(transaction.inital_amount))} {sellCurrencyName}</td>
            <td className="py-1">{transaction.converted_amount.toFixed(significantDigits(transaction.converted_amount))} {buyCurrencyName}</td>
          </tr>
        )
      }
      return rows
    }

    const generateUserTransactions = () => {
      let rows: JSX.Element[] = []
      if (uuTrnsPage === 0) return rows
      for (let i = pageStartIndex(recordsPerPage, uuTrnsPage);
        i < pageEndIndex(recordsPerPage, uuTrnsPage, uuTrnsTotalPages, transactions.userToUserTransactions.length); i++) {
        const transaction = transactions.userToUserTransactions[i]
        const CurrencyName = findCurrencyName(transaction.currency_id);
        const recipient = findUser(transaction.wallet_recipient_id);
        rows.push(
          <tr className='border-b border-gray-700 hover:bg-gray-700 text-center items-center' key={transaction.id}>
            <td className="py-1">{transaction.id}</td>
            <td className="py-1">{recipient}</td>
            <td className="py-1">{new Date(transaction.transaction_date).toLocaleString()}</td>
            <td className="py-1">{transaction.amount.toFixed(significantDigits(transaction.amount))} {CurrencyName} </td>
          </tr>
        )
      }
      return rows
    }

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
                  <Paginator currentPage={iTrnsPage} totalPages={iTrnsTotalPages} onPageChange={setITrnsPage} />
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
                      {generateInnerTransactions()}
                    </tbody>
                  </table>

                  <h1 className='m-5 text-3xl'>Wymiany z użytkownikami</h1>
                  <Paginator currentPage={uuTrnsPage} totalPages={uuTrnsTotalPages} onPageChange={setUUTrnsPage} />
                  <table className="w-10/12 mx-auto border-collapse border-b-1 border-gray-300">
                    <thead>
                      <tr className='border-b border-gray-300'>
                        <th className="">Numer transakcji</th>
                        <th className=""> Wysłano do</th>
                        <th className=""> Data wykonania</th>
                        <th className=""> Kwota</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generateUserTransactions()}
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
