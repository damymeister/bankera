import '@/app/globals.css';
import React from "react";
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6';

export default function Paginator (props: {
    currentPage: number,
    totalPages: number,
    onPageChange: React.Dispatch<React.SetStateAction<number>>
}) {
    return (
        <div className='flex flex-row gap-2 items-center justify-center'>
            <FaAnglesLeft color={props.currentPage === 1 ? '#555555' : '#efefef'} onClick={() => {
                props.onPageChange(1)
            }}/>
            <FaAngleLeft color={props.currentPage === 1 ? '#555555' : '#efefef'} onClick={() => {
                if (props.currentPage > 1) props.onPageChange(props.currentPage - 1)
            }} />
            <input type="number" min={1} max={props.totalPages} value={props.currentPage}
            className="w-20 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={(e) => {
                const val = (e.target.value === '') ? 1 : parseInt(e.target.value)
                if (val > 0 && val <= props.totalPages) props.onPageChange(val)
            }} />
            <FaAngleRight color={props.currentPage === props.totalPages ? '#555555' : '#efefef'} onClick={() => {
                if (props.currentPage < props.totalPages) props.onPageChange(props.currentPage + 1)
            }} />
            <FaAnglesRight color={props.currentPage === props.totalPages ? '#555555' : '#efefef'} onClick={() => {
                props.onPageChange(props.totalPages)
            }} />
        </div>
    )
}