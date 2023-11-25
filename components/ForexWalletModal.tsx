import '@/components/css/home.css';
import { GrClose } from "react-icons/gr";
import React, { ChangeEventHandler, useEffect, useState } from 'react';
import { postCurrencyStorage, updateCurrencyStorage } from '@/pages/api/services/currencyStorageService';
import { GiMoneyStack } from "react-icons/gi";
import { FaWindowClose }  from "react-icons/fa";
import SnackBar from '@/components/snackbar';
import {FaExclamation}  from "react-icons/fa";
import {ICurrencyStorage, IUpdateSelectedStorage, ClickedCurrency} from '@/lib/interfaces/currencyStorage';
import { checkExistenceOfForexWallet } from '@/pages/api/services/forexWalletService';
import { checkExistenceOfWallet } from '@/pages/api/services/walletService';
export default function ForexWalletModal(props:any){
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
    const [snackMess, setsnackMess] = useState<string>("")
    const [snackStatus, setsnackStatus] = useState<string>("danger")
    const [amountToChange, setAmountToChange] = useState<number>(0.0);
    const [currencyToSend, setCurrencyToSend] = useState<number>(0);
    const [clickedCurrencyData, setClickedCurrencyData] = useState<ClickedCurrency>({
      clickedCurrencyAmount: -1.0,
      clickedCurrencyName: '',
      clickedCurrencyStorageID: -1,
      clickedCurrencyCurrencyID: -1,
    });

    const snackbarProps = {
    status: snackStatus,
    icon: <FaExclamation />,
    description: snackMess
    };

    useEffect(()=>{
    setTimeout(()=>{
        setShowSnackbar(false);
    }, 4000)
    },[showSnackbar])

    useEffect(()=>{
      setClickedCurrencyData((data) => ({
        ...data,
        clickedCurrencyAmount: props.walletData[0].amount,
        clickedCurrencyName: props.findCurrencyName(props.walletData[0].currency_id),
      }));
    },[])

  
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const insertedValue = e.target.value;
      setAmountToChange(parseFloat(insertedValue));
    }

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const insertedValue = e.target.value;
      setCurrencyToSend(parseInt(insertedValue));
      const currentCurrency = props.walletData.filter((data: ICurrencyStorage) => data.id == parseInt(insertedValue));
      console.log(currentCurrency);
      setClickedCurrencyData((data) => ({
        ...data,
        clickedCurrencyAmount: currentCurrency[0].amount,
        clickedCurrencyName: props.findCurrencyName(currentCurrency[0].currency_id),
        clickedCurrencyStorageID: currentCurrency[0].id,
        clickedCurrencyCurrencyID: currentCurrency[0].currency_id
      }));
    }

    const mapUserOwnedCurrencies = () =>{
      console.log(props.walletData);
      if(!props.walletData || props.walletData.length == 0){
        return "Nie posiadasz żadnych walut w portfelu."
      }

      const userCurrencies = props.walletData;
        return(
          <select className='bgdark' value={currencyToSend} onChange={handleCurrencyChange}>
            {userCurrencies.map((data : ICurrencyStorage) =>{
              return(
                <option key={data.id} value={data.id}>
                  {props.findCurrencyName(data.currency_id)}
                </option>
              )
            })}
          </select>
        )
    }
    const checkIfOperationPermitted = () => {
      if(amountToChange == 0 || amountToChange == 0.0 || amountToChange > clickedCurrencyData.clickedCurrencyAmount){
        return false
      }
      return true
    }

    const transferMoneyToForex = async () =>{
      if(!checkIfOperationPermitted()){
        setSnackbarProps({ snackStatus: "danger", message: "Wprowadziłeś nieprawidłowe wartości.", showSnackbar: true });
        return
      }
      try{
        const returnedWalletID = await checkExistenceOfForexWallet();
        if(returnedWalletID <=0 || returnedWalletID == undefined || returnedWalletID == null){
          setSnackbarProps({ snackStatus: "danger", message: "Portfel Forex użytkownika nie istnieje!.", showSnackbar: true });
          return
        }
        await updateCasualWallet("walletToForexWallet")
        await updateForexWallet("walletToForexWallet")
      }catch(error){
        console.log(error);
        setSnackbarProps({ snackStatus: "danger", message: "Wystąpił błąd podczas wykonywania transferu.", showSnackbar: true });
      }
    }

    const transferMoneyToCasualWallet = async () =>{
      if(!checkIfOperationPermitted()){
        setSnackbarProps({ snackStatus: "danger", message: "Wprowadziłeś nieprawidłowe wartości.", showSnackbar: true });
        return
      }
      try{
        const returnedWalletID = await checkExistenceOfWallet();
        if(returnedWalletID <=0 || returnedWalletID == undefined || returnedWalletID == null){
          setSnackbarProps({ snackStatus: "danger", message: "Portfel użytkownika nie istnieje!.", showSnackbar: true });
          return
        }
        await updateForexWallet("forexWalletToCasualWallet")
        await updateCasualWallet("forexWalletToCasualWallet")
      }catch(error){
        console.log(error);
        setSnackbarProps({ snackStatus: "danger", message: "Wystąpił błąd podczas wykonywania transferu.", showSnackbar: true });
      }
    }

    const updateCasualWallet = async (operationType : string) =>{

      if(operationType == "walletToForexWallet"){
        const newBalance = clickedCurrencyData.clickedCurrencyAmount - amountToChange
        const dataToSend = {id: clickedCurrencyData.clickedCurrencyStorageID, amount: newBalance};
        if (!window.confirm("Czy na pewno chcesz przelać pieniądze do portfela Forex?")) return
        const res = await updateCurrencyStorage(dataToSend);
        setClickedCurrencyData((data: ClickedCurrency) => ({
          ...data,
          clickedCurrencyAmount: newBalance,
        }));
        setSnackbarProps({snackStatus: "danger", message: res.message, showSnackbar: true});
        setAmountToChange(0);
        return;
      }

    }

    const updateForexWallet = async (operationType : string) =>{
      if(operationType == "walletToForexWallet"){
        
        return;
      }
    }
    
    const setSnackbarProps = ({ snackStatus, message, showSnackbar }: { snackStatus: string, message: string, showSnackbar?: boolean }) => {
      if (snackStatus && message) {
        setsnackStatus(snackStatus);
        setsnackMess(message);
  
        if (showSnackbar !== undefined) {
          setShowSnackbar(showSnackbar);
        }
    };
  }
    return (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-80 text-white ">
            {showSnackbar && <SnackBar snackbar={snackbarProps} setShowSnackbar={setShowSnackbar} />}
          <div className="lg:w-2/5 w-2/3 py-2 lg:h-1/3 min-h-2/3 h-auto bgdark text-white rounded-xl relative border-2 border-black borderLight p-6">
              <div className="text-white flex flex-col items-center">
              <div className='flex flex-col font-bold mb-4 py-6'>
              <h2 className="text-lg mb-4">Manage your Forex Wallet</h2>
                <label htmlFor="currentAmount" className="font-bold">
                  Current Value: {clickedCurrencyData.clickedCurrencyAmount === -1.0 && clickedCurrencyData.clickedCurrencyName === '' ? '-' : clickedCurrencyData.clickedCurrencyAmount + ' ' + clickedCurrencyData.clickedCurrencyName}
                </label>
              </div>
                  <div>
                    <p className="font-bold">Choose currency</p>
                    {mapUserOwnedCurrencies()}
                  </div>
                <div className='flex flex-row my-6'>
                <label htmlFor="name" className="font-bold mr-1 flex items-center justify-center"><GiMoneyStack className="cursor-pointer text-white text-2xl mr-2 py-4" /> Amount:</label>
                  <input
                    placeholder="0"
                    id="name"
                    type="number"
                    min="0"
                    max={clickedCurrencyData.clickedCurrencyAmount}
                    disabled={clickedCurrencyData.clickedCurrencyAmount === 1.0}
                    className="w-24 font-bold border border-white rounded-lg px-1 bgdark focus:border-black overflow-y-auto resize-none"
                    onChange={handleAmountChange}
                    value={amountToChange}
                  />
                </div>
              <button onClick={() => transferMoneyToForex()} className='className="py-4 button2 text-white rounded-xl'>Transfer</button>
              </div>
            <button onClick={() => props.closeForexWalletModal()} className="absolute right-2 top-2 ">
              <FaWindowClose className="text-white w-6 inline mr-3 cursor-pointer hover:text-slate-200 " />
            </button>
          </div>
        </div>
      
    );  
}