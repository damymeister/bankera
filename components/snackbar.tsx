import { IconType } from 'react-icons';
import { useState, useEffect } from 'react';

import '@/components/css/home.css';

interface SnackBar {
    status: string,
    icon: React.JSX.Element,
    description: string
}

export default function SnackBar(props: { snackbar: SnackBar }) {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const getBackgroundColor = () => {
        if (props.snackbar.status === 'success') {
            return 'bg-[#BB86FC] border-[#BB86FC]';
        } else if (props.snackbar.status === 'danger') {
            return 'bg-red-500 border-[#000000]';
        }
        return '';
    };
    
    return (
        <>
            {show && (
                <div className="snackbar">
                    <div className= {` w-1/5 ${getBackgroundColor()} pr-4 border border-[#BB86FC]  bg-[#2e243ab2]  items-center text-indigo-100 leading-none lg:rounded flex lg:inline-flex `} role="alert">
                        <span className={`flex rounded ${getBackgroundColor()}  uppercase px-4 py-4 text-md font-bold mr-3`}>{props.snackbar.icon}</span>
                        <span className="font-semibold   mr-2 text-left flex-auto">{props.snackbar.description}</span>
                    </div>
                </div>
            )}
        </>
    );
}