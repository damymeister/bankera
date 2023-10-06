import Layout from '@/app/layoutPattern';
import React, { useEffect, useState } from 'react';


export default function WalletModal(props){
    <Layout>
        <div class="fixed inset-0 flex items-center justify-center w-full h-full bg-black bg-opacity-80">
            <div class="lg:w-1/4 w-2/3 py-2 lg:min-h-2/3 min-h-1/3 h-auto bg-white rounded-xl z-9999 relative border-2">
                <h1>Modal</h1>
            </div>
            <button onclick={props.closeWalletModal} class="absolute right-2 top-2"><font-awesome-icon icon="fa-solid fa-x" class="w-6 inline mr-3" /></button>
        </div>
    </Layout>
}