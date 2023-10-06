import Layout from '@/app/layoutPattern';
import React, { useEffect, useState } from 'react';
import { getWalletData, handleCreateWallet, handleDeleteWallet, handleEditWallet } from './api/services/walletService';
import WalletModal from '@/components/WalletModal';

export default function Wallet() {
  const [walletData, setWalletData] = useState([]);
  const [error, setError] = useState("");
  const [showWalletModal, setShowWalletModal] = useState(false);
  
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const promiseWalletData = await getWalletData();
        if (promiseWalletData) {
          setWalletData(promiseWalletData);
        }
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        setError('Error fetching wallet data.');
      }
    };

    fetchWalletData();
  }, []);


  const closeWalletModal =  () =>{
    setShowWalletModal(false);
  }

  return (
    <Layout>
      <div>
        {walletData.length === 0 ?
          <div>
            <h3>You do not have a wallet yet! Create one below!</h3>
            <button onClick={() => setShowWalletModal(true) } className="p-4 rounded-xl mt-4 bg-black mb-4 cursor-pointer">Create Wallet</button>
          </div> :
          <div>
           <h1>jest</h1>
          </div>
        }
      </div>
      {showWalletModal ? 
            <WalletModal closeWalletModal={closeWalletModal} />: null
        }
    </Layout>
  );
}
