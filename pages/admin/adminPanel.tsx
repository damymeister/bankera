import '@/components/css/tailwind.css';
import '@/components/css/home.css';
import '@/app/globals.css';
import '@/components/css/post.css';
import React, { useState, useEffect } from 'react';
import Layout from '@/app/layoutPattern';

import {FaTrash, FaEdit, FaHistory, FaUser, FaFolderOpen}  from "react-icons/fa";
import { User } from '@prisma/client';

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/auth/admin/user');
      const data = await response.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <Layout>
    <div className="relative flex flex-col overflow-hidden bg-gray-50 py-6">
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow text-center">
        <div className="flex justify-center space-x-4 text-center">
          <span className="flex items-center space-x-2 text-gray-500">
            <FaUser></FaUser>
            <span className="font-bold border-b border-gray-300">Zarządzaj użytkownikami</span>
          </span>
          <span>|</span>
          <a href="/news" className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 hover:border-b  hover:border-gray-300">
            <FaFolderOpen></FaFolderOpen>
            <span className=''>Zarządzaj postami</span>
          </a>
          <span>|</span>
          <span className="flex items-center space-x-2 text-gray-500">
            <FaUser></FaUser>
            <span className="text-gray-500 hover:text-gray-700 hover:border-b  hover:border-gray-300">Placeholder</span>
          </span>
        </div> 
      </nav>
      
      <div className="relative bg-white px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:rounded-lg sm:px-10 w-screen">
        <div className="mx-auto">
          <div className="text-slate-600 border-b border-gray-300 uppercase font-bold">Admin panel</div>
          <div className="divide-y divide-gray-300/50">
            <div className="space-y-6 py-8 text-base leading-7 text-gray-600">
            <p className='text-left'>Zarejestrowani użytkownicy:</p>
          <table className="w-11/12">
            <thead>
              <tr className='border-y border-gray-300 px-8'>
                <th className="px-1">ID</th>
                <th className="px-1">Imie</th>
                <th className="px-1">Nazwisko</th>
                <th className="px-1">Email</th>
                <th className="px-1">Hasło</th>
                <th className="px-1">Telefon</th>
                <th className="px-1">Role</th>
                <th className="px-1">Akcje</th> {/* Added column for buttons */}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-100 text-center items-center">
                  <td className="px-1 ">{user.id}.</td>
                  <td className="px-1 ">{user.first_name}</td>
                  <td className="px-1 ">{user.last_name}</td>
                  <td className="px-1 ">{user.email}</td>
                  <td className="px-1 ">{user.password}</td>
                  <td className="px-1 ">{user.phone_number}</td>
                  <td className="text-red-600 border-rounded1">{user.role_id}</td>
                  <td className="py-3 m-1 px-2 flex flex-row  justify-center">
                    <FaEdit className="text-blue-400 hover:text-blue-800 mx-1">Edit</FaEdit>
                    <FaTrash className="text-red-400 hover:text-red-800 mx-1">Delete</FaTrash>
                    <FaHistory className="text-green-400 hover:text-green-800 mx-1">Delete</FaHistory>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>


  );
};

export default UsersTable;