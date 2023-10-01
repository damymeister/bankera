"use client"
import '@/components/css/home.css';
import '@/components/css/forms.css';
import  '@/app/globals.css';
import React, { useState } from "react";
import Link from "next/link";
import Layout from "@/app/layoutPattern";
import { PrismaClient } from "@prisma/client";



export default function Register() {
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
  
    const handleRegister = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ first_name, last_name, email, password }),
        });
  
        if (response.ok) {
          console.log("New user created");
          // Redirect or show success message
        } else {
          console.error("Error creating user");
          // Show error message
        }
      } catch (error) {
        console.error("Error creating user:", error);
        // Show error message
      }
    };
    return (
        <Layout>
            <div className="formContainer">
                <form onSubmit={handleRegister}>
                    <h2>Utwórz konto</h2>

                    <div className="inputs">
                        <div className="inputsBorder">
                            <input
                                type="text"
                                placeholder="First name"
                                value={first_name}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="field"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={last_name}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="field"
                            />
                            <span className="input-border"></span>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="field"
                            />
                            <span className="input-border"></span>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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