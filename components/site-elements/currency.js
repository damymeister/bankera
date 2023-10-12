import '../css/currency.css';
import '../css/home.css';
export default function Currency({ currency }) {
    const { name, buy, sell } = currency;

    return (
        <div className="currency">
             <p>{currency.currency}</p>
       <p>{currency.name}</p>
       <p>Kupno: {currency.buy}</p>
       <p>Sprzedaż: {currency.sell}</p>
        </div>
    );
}
module.exports