import { CurrencyConverter } from './converter';

const converter = new CurrencyConverter();
converter.setExchangeRate('EUR', 'RUB', 88);
// converter.setExchangeRate('EUR', 'USD', 1.2);
converter.setExchangeRate('EUR', 'TRY', 10.1);
converter.setExchangeRate('USD', 'TRY', 8.56);
console.log('convert', converter.getExchangeRate('USD', 'RUB'));
