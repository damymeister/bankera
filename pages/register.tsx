"use client"
import '@/components/css/home.css';
import '@/components/css/forms.css';
import  '@/app/globals.css';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "@/app/layoutPattern";
import { PrismaClient } from "@prisma/client";
import api_url from '@/lib/api_url';
import axios from 'axios'
import { useRouter } from 'next/router';
import { FaExclamation } from 'react-icons/fa';
import SnackBar from '@/components/snackbar';


export default function Register() {
    const router = useRouter()
    const [data, setData] = useState({first_name: '', last_name: '', email: '', password: '', phone_number: ''})
    const [error, setError] = useState('')
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [snackMess, setsnackMess] = useState("Błąd w trakcie rejestracji")
    const [snackStatus, setsnackStatus] = useState("danger")
    const snackbarProps = {
      status: snackStatus,
      icon: <FaExclamation />,
      description: snackMess
    };

    const handleRegister = async (e: React.SyntheticEvent) => {
      e.preventDefault();
      try {
        const url = api_url('register')
        const { data: res, status } = await axios.post(url, data, {headers: {Accept: 'application/json'}})
        console.log(res.message)
        if (status === 201) {
            setsnackStatus("success")
            setsnackMess("Zarejestrowano pomyślnie")
            setShowSnackbar(true)
            setTimeout(() => {
                router.push('/login')
            }, 2000);
    
           
    } // 201 = created
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (
              error.response &&
              error.response.status >= 400 &&
              error.response.status <= 500   
          ) 
          {
              setError(error.response.data.message)
              setsnackStatus("danger")
              setShowSnackbar(true)
              setsnackMess("Błąd w trakcie rejestracji")
          }
        }
        else console.log('unexpected error: ', error)
      }
    };

    useEffect(() => {
      // Registered users should not access this page
      const handleGetPrivilege = async () => {
        try {
            const url = api_url('privilege')
            const { data} = await axios.get(url, {headers: {Accept: 'application/json'}})
            if (parseInt(data.privilege) > 0) router.back()
        } catch (error) {
            console.log('unexpected error: ', error)
        }
      }
      handleGetPrivilege()
    }, [])

    return (
        <Layout>
            {showSnackbar && <SnackBar snackbar={snackbarProps} setShowSnackbar={setShowSnackbar} />}
            <div className="formContainer">
                <form className="frame" onSubmit={handleRegister}>
                    <h2>Utwórz konto</h2>

                    <div className="inputs">
                        <div className="inputsBorder">
                            <input
                                type="text"
                                placeholder="First name"
                                value={data.first_name}
                                onChange={(e) => setData({...data, first_name: e.target.value})}
                                required
                                className="field"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={data.last_name}
                                onChange={(e) => setData({...data, last_name: e.target.value})}
                                required
                                className="field"
                            />
                            <span className="input-border"></span>
                            <input
                                type="email"
                                placeholder="Email"
                                value={data.email}
                                onChange={(e) => setData({...data, email: e.target.value})}
                                required
                                className="field"
                            />
                            <span className="input-border"></span>
                            <input
                                type="text"
                                placeholder="Phone Number"
                                value={data.phone_number}
                                onChange={(e) => setData({...data, phone_number: e.target.value})}
                                required
                                className="field"
                            />
                            <span className="input-border"></span>
                            <input
                                type="password"
                                placeholder="Password"
                                value={data.password}
                                onChange={(e) => setData({...data, password: e.target.value})}
                                required
                                className="field"
                            />
                        </div>
                        <button type="submit" className="button my1">
                            Zarejestruj
                        </button>
                    </div>

                    <h4>
                        Posiadasz już utworzone konto?{" "}
                        <Link href="/login">Zaloguj się</Link>
                    </h4>
                </form>
            </div>
        </Layout>
    );
}