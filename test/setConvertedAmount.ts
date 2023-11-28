export const setConvertedAmount = (inputValue: number, currencyRate: number) => {
    return (inputValue * currencyRate);
}