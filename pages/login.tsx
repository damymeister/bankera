"use client"
import '@/components/css/home.css';
import '@/components/css/forms.css';
import  '@/app/globals.css';
import  Link  from 'next/link';
import Layout from '@/app/layoutPattern';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (response.ok) {
          
        } else {
          console.log("error while logging")
        }
      } catch (error) {
        
      }
    };

  return (
    <Layout>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="field"
              />
              <span className="input-border"></span>
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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