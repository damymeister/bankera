"use client"
import '@/components/css/home.css';
import '@/components/css/forms.css';
import  '@/app/globals.css';
import  Link  from 'next/link';
import Layout from '@/app/layoutPattern';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';
import api_url from '@/lib/api_url';
import axios from 'axios';
import SnackBar from '@/components/snackbar'
import {FaExclamation}  from "react-icons/fa";
const prisma = new PrismaClient();

export default function LoginPage() {
    const router = useRouter()
    const [data, setData] = useState({email: '', password: ''})
    const [error, setError] = useState('')
    const [showSnackbar, setShowSnackbar] = useState(false)
    const [snackMess, setsnackMess] = useState("")
    const [snackStatus, setsnackStatus] = useState("danger")
    const snackbarProps = {
      status: snackStatus,
      icon: <FaExclamation />,
      description: snackMess
  };


    const handleSubmit = async (e: React.SyntheticEvent) => {
      e.preventDefault();
      try {
        const url = api_url('login')
        const { data: res, status } = await axios.post(url, data, {headers: {Accept: 'application/json'}})
        console.log(res.message)
        if (status === 200) {
         
          router.push('/') // 200 = Auth OK
        }
         
      } catch (error) {
        
        setShowSnackbar(true);
        setsnackMess("Błąd przy logowaniu");
        if (axios.isAxiosError(error)) {
          if (
              error.response &&
              error.response.status >= 400 &&
              error.response.status <= 500
          ) {
              setError(error.response.data.message)
          }
        }
        else console.log('unexpected error: ', error)
      }
    }

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
      {showSnackbar && <SnackBar snackbar={snackbarProps} />}
      <div className="formContainer">
      
        <form className="frame" onSubmit={handleSubmit}>
          <h2>Zaloguj się</h2>
          <div className="inputs">
            <div className="inputsBorder">
              <span className="input-border"></span>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={data.email}
                onChange={(e) => setData({...data, email: e.target.value})}
                required
                className="field"
              />
              <span className="input-border"></span>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={data.password}
                onChange={(e) => setData({...data, password: e.target.value})}
                required
                className="field"
              />
              <span className="input-border"></span>
            </div>
            <h4 className="textright">
              <Link href="">Nie pamiętasz hasła?</Link>
            </h4>
            <button type="submit" className="button my1">
              Zaloguj
            </button>
          </div>
          <h4>
            Nie masz jeszcze konta? <Link href="/register"> Załóż darmowe konto</Link>
          </h4>
        </form>
      </div>
     
    </Layout>
  );
}