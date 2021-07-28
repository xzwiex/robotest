interface CrossExchange {
    complexity: number;
    rate: number;
}

export class CurrencyConverter {
    private rates: { [pair: string]: number } = {};

    private getPairName(firstCurrency: string, secondCurrency: string) {
        return [firstCurrency, secondCurrency].sort().join('/'); // [EUR, RUB] -> EUR/RUB, [RUB, EUR] -> EUR/RUB
    }

    setExchangeRate(firstCurrency: string, secondCurrency: string, exchangeRate: number): void {
        const pair = this.getPairName(firstCurrency, secondCurrency);
        const rate = pair.startsWith(firstCurrency) ? exchangeRate : 1 / exchangeRate;
        this.rates[pair] = rate;
    }

    private getDirectRate(firstCurrency: string, secondCurrency: string) {
        const pair = this.getPairName(firstCurrency, secondCurrency);
        const rate = this.rates[pair];
        // Has direct rate
        if (rate) {
            return pair.startsWith(firstCurrency) ? rate : 1 / rate; // EUR/RUB = 1 / RUB/EUR
        }
        return 0;
    }

    getExchange(firstCurrency: string, secondCurrency: string, complexity = 1): CrossExchange {
        if (complexity > Object.keys(this.rates).length) {
            return { complexity, rate: 0 };
        }
        const directRate = this.getDirectRate(firstCurrency, secondCurrency);
        if (directRate) {
            console.log('direct rate found', firstCurrency, secondCurrency, directRate);
            return { complexity, rate: directRate };
        }
        for (let pair in this.rates) {
            if (pair.includes(firstCurrency)) {
                const crossCurrency = pair.split('/').find((c) => c !== firstCurrency); // Second currency
                const firstRate = this.getDirectRate(firstCurrency, `${crossCurrency}`);
                const crossRate = this.getExchange(`${crossCurrency}`, secondCurrency);
                if (crossRate.rate !== 0) {
                    console.log('crossrate found', firstCurrency, crossCurrency, firstRate, crossRate.rate);
                    return { complexity: complexity + 1, rate: firstRate * crossRate.rate };
                }
            }
        }

        return this.getExchange(firstCurrency, secondCurrency, complexity + 1);

    }

    getExchangeRate(firstCurrency: string, secondCurrency: string): number {
        return this.getExchange(firstCurrency, secondCurrency).rate;
    }
}