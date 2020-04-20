export const toFormatterCurrency = (value) => {
    const formatterDolar = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    return formatterDolar.format(value);
}

export const addZero = (value) => {
    return value < 10 ? '0' + value : value;
}