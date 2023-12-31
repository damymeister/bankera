import '@/components/css/tailwind.css';
import '@/components/css/home.css';
import '@/app/globals.css';
import '@/components/css/post.css';
import React, { useState, useEffect } from 'react';
import Layout from '@/app/layoutPattern';

import {FaTrash, FaEdit, FaHistory, FaUser, FaFolderOpen, FaExclamation, FaTimes, FaSave}  from "react-icons/fa";
import { User } from '@prisma/client';
import Link from 'next/link';
import router from 'next/router';
import api_url from '@/lib/api_url';
import axios from 'axios';
import SnackBar from '@/components/snackbar'
import { number } from 'joi';

type Role = {
  id: number;
  name: string;
  user: User[];
};

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackMess, setsnackMess] = useState("Usunięto użytkownika");
  const [snackStatus, setsnackStatus] = useState("success");
  const [editMode, setEditMode] = useState(false);
  const [editedUserId, setEditedUserId] = useState<number | null>(0);
  const [selectedRole, setSelectedRole] = useState<number>(0);
  const snackbarProps = {
    status: snackStatus,
    icon: <FaExclamation />,
    description: snackMess
};
  const [roles, setRoles] = useState<Role[]>([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/auth/admin/user');
      const data = await response.json();

      const rolesurl = api_url(`auth/admin/roles`);
      const roleRes = await axios.get(rolesurl, { headers: { Accept: 'application/json' } });

      setUsers(data);
      setRoles(roleRes.data);
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (id:number) => {
    try {
        const url = api_url('/auth/admin/manageUser')
        const { data } = await axios.delete(url, {data: {id:id}, headers: {Accept: 'application/json'}})
        window.location.reload()
    } catch (error) {
        console.log('unexpected error: ', error)
    }
  }

  const handleUpdateRole = async (id: number) => {
    try {
      const url = api_url(`/auth/admin/roles?id=${editedUserId}`);
      const params = { role_id: selectedRole };

      const { data } = await axios.put(url, params, {
        headers: { Accept: 'application/json' },
      });

      window.location.reload();
    } catch (error) {
      console.log('unexpected error: ', error);
    }
  };

  const findRole = (role_id: number): string | null => {
    if (roles) {
      const role = roles.find((role: { id: number; }) => role.id === role_id);
      if (role) {
        return role.name;
      }
    }
    return null;
  };

  return (
<Layout>
  {showSnackbar && <SnackBar snackbar={snackbarProps} setShowSnackbar={setShowSnackbar} />}
  <div className="relative flex flex-col overflow-hidden bg-gray-900 py-6 containerCustom">
    <nav className="flex items-center justify-between px-6 py-4 bgdark shadow text-center">
      <div className="flex justify-center space-x-4 text-center">
        <span className="flex items-center space-x-2 text-gray-200">
          <FaUser></FaUser>
          <span className="font-bold border-b border-gray-300">Zarządzaj użytkownikami</span>
        </span>
        <span>|</span>
        <Link href="/news" className="flex items-center space-x-2 text-gray-200 hover:text-gray-300 hover:border-b hover:border-gray-300">
          <FaFolderOpen></FaFolderOpen>
          <span className=''>Zarządzaj postami</span>
        </Link>
        <span>|</span>
      </div> 
    </nav>
    <div className="relative bgdark px-6 pb-8 pt-10 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:rounded-lg sm:px-10 w-screen">
      <div className="mx-auto">
        <div className="text-gray-200 border-b border-gray-300 uppercase font-bold">Admin panel</div>
        <div className="divide-y divide-gray-300/50">
          <div className="space-y-6 py-8 text-base bgGlass leading-7 text-gray-200">
            <p className='text-left px-5'>Zarejestrowani użytkownicy:</p>
            <table className="w-10/12 mx-auto border-collapse border-b-1 border-gray-300">
              <thead>
                <tr className='border-y border-gray-300 px-8'>
                  <th className="px-1">ID</th>
                  <th className="px-1">Imie</th>
                  <th className="px-1">Nazwisko</th>
                  <th className="px-1">Email</th>
                  <th className="px-1">Telefon</th>
                  <th className="px-1">Role</th>
                  <th className="px-1">Akcje</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const roleName = findRole(user.role_id);
                  const isEditMode = user.id === editedUserId;

                  return (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700 text-center items-center">
                      <td className="px-1 ">{user.id}.</td>
                      <td className="px-1 ">{user.first_name}</td>
                      <td className="px-1 ">{user.last_name}</td>
                      <td className="px-1 ">{user.email}</td>
                      <td className="px-1 ">{user.phone_number}</td>
                      <td className="text-[#BB86FC]">{roleName}</td>
                      <td className="py-3 m-1 px-2 flex flex-row  justify-center">
                        {isEditMode ? (
                          <>

                            <select
                              className="bgdark border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                              value={selectedRole}
                              onChange={(e) => setSelectedRole(parseInt(e.target.value))}
                            >
                              <option value={0} disabled>Wybierz:</option>
                              <option value={1}>Użytkownik</option>
                              <option value={2}>Redaktor</option>
                              <option value={3}>Admin</option>
                            </select>
                            <div className='flex flex row items-center justfy-center pl-2'>
                            <FaSave
                              className="text-green-400 hover:text-green-800 mx-1"
                              onClick={() => {
                                handleUpdateRole(selectedRole);
                                setEditMode(false);
                                setEditedUserId(null);
                              }}
                            >
                              Save
                            </FaSave>

                            <FaTimes
                              className="text-red-400 hover:text-red-800 mx-1"
                              onClick={() => {
                                setEditMode(false);
                                setEditedUserId(null);
                              }}
                            >
                              Cancel
                            </FaTimes> 

                            </div>
                           

                          </>
                        ) : (
                          <>
                            <FaEdit
                              className="text-blue-400 hover:text-blue-800 mx-1"
                              onClick={() => {
                                setEditMode(true);
                                setEditedUserId(user.id);
                              }}
                            >
                              Edit
                            </FaEdit>
                            <FaTrash
                              className="text-red-400 hover:text-red-800 mx-1"
                              onClick={() => {
                                if (!window.confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;
                                handleDeleteUser(user.id);
                                setShowSnackbar(true);
                              }}
                            >
                              Delete
                            </FaTrash>
                            <Link href={`/admin/userHistory?id=${user.id}`} className="text-green-400 hover:text-green-800 mx-1">
                              <FaHistory />
                            </Link>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
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