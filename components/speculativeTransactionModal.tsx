import '@/components/css/home.css';
import React, { useEffect, useState } from 'react';
import { FaWindowClose }  from "react-icons/fa";
import SnackBar from '@/components/snackbar';
import { FaExclamation }  from "react-icons/fa";
import { getCurrencyPair } from '@/pages/api/services/currencyPairService';
import { SpeculativeTransactionCreate } from '@/lib/interfaces/speculative_Transaction';
import { handleCreateSpeculativeTransaction } from '@/pages/api/services/speculativeTransactionService';
import { getForexCurrencyStorageById } from '@/pages/api/services/forexCurrencyStorageService';
export default function SpeculativeTransactionModal(props:any){
    //Snackbar states
    const [showSnackbar, setShowSnackbar] = useState<boolean>(false)
    const [snackMess, setsnackMess] = useState<string>("")
    const [snackStatus, setsnackStatus] = useState<string>("danger")
    const lot = 100000;//Lot is always the same
    const pipSize = 0.0001;//Pip is always the same, if currencyPair has currency "Yen" it can be 0.01 but it is not implemented yet
    const [currentVolume, setCurrentVolume] = useState<number>(1);
    const [stopLossIncluded, setStopLossIncluded] = useState<boolean>(false);
    const [takeProfitIncluded, setTakeProfitIncluded] = useState<boolean>(false);
    const [baseCurrencyAmount, setBaseCurrencyAmount] = useState<number>(0);
    const [createSpeculativeTransactionData, setCreateSpeculativeTransactionData] =  useState<SpeculativeTransactionCreate>({
        forex_wallet_id: 0,
        transaction_type: 1,
        currency_pair_id: -1,
        financial_leverage: 0.05,
        lots: lot,
        pip_price: 0,
        entry_course_value: -1,
        transaction_balance: 0,
        entry_date: new Date(),
        base_currency_id: props.buyingCurrency.id,
        deposit_amount: 0,
        stop_loss:-1,
        take_profit:-1})

    //Snackbar functions
    const snackbarProps = {
        status: snackStatus,
        icon: <FaExclamation />,
        description: snackMess
    };
 
    
    const setSnackbarProps = ({ snackStatus, message, showSnackbar }: { snackStatus: string, message: string, showSnackbar?: boolean }) => {
        if (snackStatus && message) {
          setsnackStatus(snackStatus);
          setsnackMess(message);
      
          if (showSnackbar !== undefined) {
            setShowSnackbar(showSnackbar);
          }
      };
      }
    
    const calculateData = () =>{
        
        setRate();
        calculatePipPrice();
        calculateTransactionBalance();
        calculateTransactionDeposit();
        calulacteBaseCurrencyAmount();
    }

    const calulacteBaseCurrencyAmount = async () => {
        const getForexCurrencyStorage = await getForexCurrencyStorageById(props.forexWalletID, props.buyingCurrency.id);
        if (!getForexCurrencyStorage.data) {
          return;
        }
        setBaseCurrencyAmount(getForexCurrencyStorage.data.forex_currency_amount);
    }
   

      const setRate = async () => {
        try {
          const currencyPair = await getCurrencyPair(props.buyingCurrency.id, props.sellingCurrency.id);
          if (!currencyPair.data) {
            return;
          }
          setCreateSpeculativeTransactionData((data)=>({
            ...data,
            currency_pair_id: currencyPair.data.id,
            entry_course_value: currencyPair.data.conversion_value,
            forex_wallet_id: props.forexWalletID,
          }));
        } catch (error) {
          console.error("Błąd pobierania pary walutowej:", error);
        }
      };

      const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        const insertedValue = e.target.value;
        setCurrentVolume(parseFloat(insertedValue))
      }

    const calculatePipPrice = () =>{
        const pipPrice = currentVolume * lot * pipSize;
        setCreateSpeculativeTransactionData((data) => ({
            ...data,
            pip_price: pipPrice
        }))
    }
    const calculateTransactionBalance = () => {
        setCreateSpeculativeTransactionData((data) => ({
            ...data,
            transaction_balance: currentVolume * lot,
        }))
    }

    const changeFinancialLeverage = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFinancialLeverage = e.target.value;
        setCreateSpeculativeTransactionData((data) => ({
            ...data,
            financial_leverage: parseFloat(newFinancialLeverage),
        }))
    }
    const changeTransactionType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newTransactionType= e.target.value;
        setCreateSpeculativeTransactionData((data) => ({
            ...data,
            transaction_type: parseInt(newTransactionType),
        }))
    }

    const calculateTransactionDeposit = () => {
        setCreateSpeculativeTransactionData((data) => ({
            ...data,
            deposit_amount: createSpeculativeTransactionData.transaction_balance * createSpeculativeTransactionData.financial_leverage
        }))
    }
    const correctSpeculativeData = () =>{
        if(createSpeculativeTransactionData.forex_wallet_id <= 0 
            || createSpeculativeTransactionData.pip_price <= 0 
            || createSpeculativeTransactionData.entry_course_value <= 0 
            || createSpeculativeTransactionData.lots <= 0 
            || (createSpeculativeTransactionData.transaction_type !== 1 && createSpeculativeTransactionData.transaction_type !== 2)
            || createSpeculativeTransactionData.deposit_amount > baseCurrencyAmount)
            {
            setSnackbarProps({ snackStatus: "danger", message: "Niepoprawne dane!", showSnackbar: true });
            return false
        }

        if((createSpeculativeTransactionData.transaction_type == 1 && stopLossIncluded && createSpeculativeTransactionData.stop_loss 
            && createSpeculativeTransactionData.stop_loss > createSpeculativeTransactionData.entry_course_value)
            || (createSpeculativeTransactionData.transaction_type == 2 && createSpeculativeTransactionData.stop_loss
                && createSpeculativeTransactionData.stop_loss < createSpeculativeTransactionData.entry_course_value))
            {
                setSnackbarProps({ snackStatus: "danger", message: "Niepoprawna wartość Stop Loss!", showSnackbar: true });
                return false
            }
        if((createSpeculativeTransactionData.transaction_type == 1 && takeProfitIncluded && createSpeculativeTransactionData.take_profit
            && createSpeculativeTransactionData.take_profit < createSpeculativeTransactionData.entry_course_value)
            || (createSpeculativeTransactionData.transaction_type == 2 && createSpeculativeTransactionData.take_profit
                && createSpeculativeTransactionData.take_profit > createSpeculativeTransactionData.entry_course_value))
            {
                setSnackbarProps({ snackStatus: "danger", message: "Niepoprawna wartość Take Profit!", showSnackbar: true });
                return false
            }

        return true
    }
    const createSpeculativeTransaction = async () =>{
            const currDate = new Date();

            if (!window.confirm("Czy na chcesz dokonać spekulacji na rynku Forex?")) return

            if(!correctSpeculativeData()){
                return;
            }

            setCreateSpeculativeTransactionData((data) => ({
                ...data,
                entry_date: currDate,
            }))

            try{
                await handleCreateSpeculativeTransaction(createSpeculativeTransactionData);
                props.closeSpeculativeTransactionModal();
                props.setSnackbarProps({ snackStatus: 'success', message: 'Dokonano transakcji spekulacyjnej!', showSnackbar: true });}
            catch(error){
                console.log(error);}
                setSnackbarProps({ snackStatus: 'danger', message: 'Wystąpił problem podczas tworzenia transakcji spekulacyjnej!', showSnackbar: true });
        }
    const setStopLoss = () =>{
        if(!stopLossIncluded){
            const newStopLoss = createSpeculativeTransactionData.entry_course_value.toFixed(5);
            setCreateSpeculativeTransactionData((data) => ({
                ...data,
                stop_loss: parseFloat(newStopLoss),
            }))
        }else{
            setCreateSpeculativeTransactionData((data) => ({
                ...data,
                stop_loss: -1,
            }))
        }
        setStopLossIncluded(!stopLossIncluded);
    }
    const setTakeProfit = () =>{
        if(!takeProfitIncluded){
            const newTakeProfit = createSpeculativeTransactionData.entry_course_value.toFixed(5);
            setCreateSpeculativeTransactionData((data) => ({
                ...data,
                take_profit: parseFloat(newTakeProfit),
            }))
        }else{
            setCreateSpeculativeTransactionData((data) => ({
                ...data,
                take_profit: -1,
            }))
        }
        setTakeProfitIncluded(!takeProfitIncluded);
    }
    useEffect(() => {
        calculateData();
    }, []);

  useEffect(() => {
    calculatePipPrice();
    calculateTransactionBalance();
    calculateTransactionDeposit();
  }, [currentVolume, createSpeculativeTransactionData.financial_leverage])

  useEffect(() => {
    calculateTransactionDeposit();
    }, [createSpeculativeTransactionData.transaction_balance]); 

    useEffect(()=>{
        setTimeout(()=>{
            setShowSnackbar(false);
        }, 4000)
    },[showSnackbar])

const checkIfDataLoaded = () =>{
    if(createSpeculativeTransactionData.entry_course_value !== -1 && createSpeculativeTransactionData.transaction_balance !== -1 && currentVolume !== -1 && createSpeculativeTransactionData.entry_course_value){
        return true
    }
    return false
}

    return (
        <div className="fixed inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-80 text-white z-50">
            {showSnackbar && <SnackBar snackbar={snackbarProps} setShowSnackbar={setShowSnackbar} />}
          <div className="lg:w-2/5 w-2/3 py-2 min-h-2/3 h-auto bgdark text-white rounded-xl relative border-2 border-black borderLight p-6">
              <div className="text-white flex flex-col items-center">
              {checkIfDataLoaded() ? (
                <div className='flex flex-col justify-center items-center font-bold mb-4 py-6 gap-6'>
                    <h2 className="text-lg mb-4">Stwórz zlecenie</h2>
                    <div className='flex flex-row gap-2 flex-wrap w-full justify-between items-center border-[#BB86FC] border-b-2'>
                        <span>Para Walutowa: {props.buyingCurrency.name}/{props.sellingCurrency.name}</span>
                        <span>Lot: 100 000 {props.buyingCurrency.name}</span>
                    </div>
                    <div className='flex flex-row gap-2 flex-wrap w-full justify-between border-[#BB86FC] border-b-2'>
                        <span>Ilość waluty: {baseCurrencyAmount.toFixed(2)} {props.buyingCurrency.name}</span>
                        <span>Kurs: {createSpeculativeTransactionData.entry_course_value.toFixed(5)}</span>
                    </div>
                    <div className='flex flex-row gap-6 flex-wrap w-full justify-between border-[#BB86FC] border-b-2 mb-6'>
                        <span>Wartość pipsa: {(createSpeculativeTransactionData.pip_price).toFixed(2)} {props.buyingCurrency.name}</span>
                        <span>Wartość kontraktu: {createSpeculativeTransactionData.transaction_balance.toFixed(0)} {props.buyingCurrency.name}</span>
                    </div>
                    <div className='flex flex-row gap-2 flex-wrap w-full justify-between border-[#BB86FC] border-b-2'>
                        <div>
                            <span>Typ transakcji: </span>
                            <select onChange={changeTransactionType} className=" text-white rounded-md border border-[#bb86fcad] bg-transparent focus:ring-2 focus:bg-[#1f1b24b2] focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                                <option value="1">Kupno</option>
                                <option value="2">Sprzedaż</option>
                            </select>
                        </div>
                        <div>
                            <span>Dźwignia finansowa: </span>
                            <select onChange={changeFinancialLeverage} className=" text-white rounded-md border border-[#bb86fcad] bg-transparent focus:ring-2 focus:bg-[#1f1b24b2] focus:ring-inset focus:ring-indigo-600 sm:text-sm">
                                <option value="0.05">0.05</option>
                                <option value="0.025">0.025</option>
                                <option value="0.1">0.1</option>
                                <option value="1">1</option>
                            </select>
                        </div>
                    </div>
                    <div className='flex flex-row gap-6 flex-wrap w-full justify-between border-[#BB86FC] border-b-2'>
                    <div className='flex flex-row gap-2'>
                            <label htmlFor="volume" className="font-bold flex items-center justify-center">Wolumen:</label>
                            <input
                                id="volume"
                                type="number"
                                min="0.01"
                                max="100"
                                step="0.1"
                                className="w-24 font-bold border border-white rounded-lg bgdark focus:border-black overflow-y-auto resize-none"
                                onChange={handleVolumeChange}
                                value={currentVolume}
                            />
                        </div>
                        <span>Wartość depozytu: {(createSpeculativeTransactionData.deposit_amount).toFixed(2)} {props.buyingCurrency.name}</span>
                    </div>
                    <div className='flex flex-row gap-6 flex-wrap w-full justify-between border-[#BB86FC] border-b-2'>
                        <div className='gap-2'>
                            <div className='flex flex-row gap-2'>
                                <input type="checkbox" onChange={() => setStopLoss()} className="text-white rounded-md border border-[#bb86fcad] bg-transparent focus:ring-2 focus:bg-[#1f1b24b2] focus:ring-inset focus:ring-indigo-600 sm:text-sm"/>
                                <span className='font-bold'>Stop loss</span>
                            </div>
                            {stopLossIncluded ? (
                                  <input
                                  id="stopLoss"
                                  type="number"
                                  min="0"
                                  step="0.00001"
                                  className="w-24 mb-2 mt-2 font-bold border border-white rounded-lg bgdark focus:border-black overflow-y-auto resize-none"
                                  onChange={(e) => {
                                      const value = parseFloat(e.target.value).toFixed(5);
                                      setCreateSpeculativeTransactionData((data) => ({
                                          ...data,
                                          stop_loss: parseFloat(value),
                                      }));
                                  }}
                                  value={createSpeculativeTransactionData.stop_loss}
                              />
                            ) : (
                                null
                            )}
                        </div>
                        <div className='gap-2'>
                            <div className='flex flex-row gap-2'>
                                <input type="checkbox" onChange={() => setTakeProfit()} className="text-white rounded-md border border-[#bb86fcad] bg-transparent focus:ring-2 focus:bg-[#1f1b24b2] focus:ring-inset focus:ring-indigo-600 sm:text-sm"/>
                                <span className='font-bold'>Take profit</span>
                            </div>
                            {takeProfitIncluded ? (
                                    <input
                                        id="takeProfit"
                                        type="number"
                                        min="0"
                                        step="0.00001"
                                        className="w-24 font-bold mb-2 border border-white rounded-lg bgdark focus:border-black overflow-y-auto resize-none mt-2"
                                        onChange={(e) => {
                                            const value = parseFloat(e.target.value).toFixed(5);
                                            setCreateSpeculativeTransactionData((data) => ({
                                            ...data,
                                            take_profit: parseFloat(value),
                                        }))}}
                                        value={createSpeculativeTransactionData.take_profit}
                                    />
                            ) : (
                                null
                            )}
                        </div>
                    </div>
                    <button onClick={() => createSpeculativeTransaction()} className='py-4 button2 text-white w-1/7 rounded-xl'>Spekulacja</button>
                </div>
                ) : (
                <span>Is loading ...</span>
                )}
            <button onClick={() => props.closeSpeculativeTransactionModal()} className="absolute right-2 top-2 ">
              <FaWindowClose className="text-white w-6 inline mr-3 cursor-pointer hover:text-slate-200 " />
            </button>
          </div>
        </div>
    </div>
    );  
}