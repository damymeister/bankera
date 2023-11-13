import '@/components/css/home.css';
import '@/components/css/contact.css';
import '@/components/css/post.css';
import '@/app/globals.css';
import Layout from '@/app/layoutPattern';
import React from "react";

export default function About() {

    return (
        <Layout>
        <div className="containerCustom borderLightY">
            <div className="my-1">
            <div className="contact">
                <h1 className="py-1 textUnderline text-3xl bold">O nas:</h1>
                <h4>Projekt został zrealizowany przez:</h4>
                <a>Mateusz Adamczyk</a>
                <a>Jakub Baran</a>
                <a>Marcin Basak</a>
                <h2 className="textUnderline text-3xl">Co możesz robić na naszej stronie?</h2>
                <div className="flex flex-col md:flex-row">
                    <h4 className="flex items-center text-xl md:p-2">Nasza strona oferuje:</h4>
                    <ul className="list-disc px-8 flex flex-col items-start justify-center">
                        <li className="py-1">Wymieniać waluty</li>
                        <li className="py-1">Dokonywać transakcji z innymi użytkownikami</li>
                        <li className="py-1">Dokonywać spekulacji na rynku forex</li>
                        <li className="py-1">Śledzić aktualne kursy walut</li>
                        <li className="py-1">Przeglądać najnowsze informacje o stanie walut</li>
                    </ul>
                </div>
            </div>
            </div>
        </div>
        </Layout> 
    )
}