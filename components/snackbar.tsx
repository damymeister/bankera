import { IconType } from 'react-icons';
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

import '@/components/css/home.css';

interface SnackBar {
    status: string,
    icon: React.JSX.Element,
    description: string
}

export default function SnackBar(props: { snackbar: SnackBar, setShowSnackbar: Dispatch<SetStateAction<boolean>> }) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(true)
        const timer = setTimeout(() => {
            props.setShowSnackbar(false)
            setShow(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const getBackgroundColor = () => {
        if (props.snackbar.status === 'success') {
            return ' border-[#BB86FC]';
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