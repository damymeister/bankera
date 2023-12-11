# TODO List

- ✓ Poprawić błędy z snackbarami
- ujednolicić język
- ✓ Paginacja do currencyExchange, wallet, forexWallet
- Ostatnia strona ma być wielkości tak jak poprzednich
- ✓ Dodać zdjęcia do postów
- ✓ Flex wrap do postów, posty wyższe niż szersze
- ✓ **FOREX**!!!
- ✓ Prosty wykres z currencyHistory
- ✓ Edycja użytkowników w adminPanelu
- ✓Implementacja speculativeTransaction
- CRON do transakcji spekulacyjnych
- ✓ Testy **SOŁ**
- ✓ Portfel Forex, transakcje Wallet -> ForexWallet i na odwrót + zapis historii do bazy danych

//CRON DO TRANSAKCJI SPEKULACYJNYCH
1) Ma się wywoływać co każdą zmianę kursów, musi iterować przez wszystkie otwarte transakcje - te które nie mają exit daty i exit kursu ustawionego, powinien sprawdzić ich stop loss oraz take profit, jeśli nowy kurs danej pary walutowej jest równy take_profit lub stop_loss danej transakcji otwartej, należy dokonać aktualizacji (zakończenia) transakcji, poprzez update exit kursu, oraz exit daty, a także wyliczyć profit_loss i też przypisać go do pola danej transakcji podczas aktualizacji (patrz forex.tsx - funkcja calculateProfitLoss a nastepnie closeTransaction).
2) Dodatkowo CRON powinien wyliczać obecny zysk otwartych transakcji (to znaczy obliczać profit_loss ) wszystkich otwartych transakcji czyli (iteruje po wszystkich otwartych transakcjach, wylicza tak jak w funkcji calculateProfitLoss - nastepnie aktualizuje tylko pole profit_loss danej transakcji spekulacyjnej (nie ma jeszcze takiej metody w serwisie, należy ją zaimplementować) i wyświetla je w tabeli z otwartymi transakcjami spekulacyjnymi w polu Obecny zysk, ale przy aktualizacji nie moze aktualizować exit daty ani exit kursu bo transakcja nadal trwa!).

# Engineering thesis

## GitHub Commands

git push https://github.com/RaViii1/engineering-thesis main

## Documentation Repository

[https://github.com/RaViii1/praca-dyplomowa](https://github.com/RaViii1/praca-dyplomowa)

## Enviornment variables

DATABASE_URL=mysql://ei_project:Project2023!@dingomc.net:3306/ei_project

## Development Version

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## DingoMC Systems Production Version

Click [here](http://dingomc.net:3001) to test officialy deployed production version  
Click [here](http://dingomc.net:3002) to connect to phpMyAdmin
