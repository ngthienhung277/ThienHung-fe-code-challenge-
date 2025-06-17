import { useState, useEffect, useRef } from 'react';
import CurrencyIcon from './CurrencyIcon.jsx';

function App() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exchangeRates, setExchangeRates] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isFromOpen, setIsFromOpen] = useState(false);
  const [isToOpen, setIsToOpen] = useState(false);

  const fromRef = useRef(null);
  const toRef = useRef(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://interview.switcheo.com/prices.json');
        const data = await response.json();
        const latestRates = data.reduce((acc, item) => {
          const { currency: curr, date, price } = item;
          const currentDate = new Date(date);
          if (!acc[curr] || new Date(acc[curr].date) < currentDate) {
            acc[curr] = { price, date };
          }
          return acc;
        }, {});
        setExchangeRates(latestRates);
      } catch (err) {
        console.error('Error fetching exchange rates:', err);
        setError('Failed to fetch exchange rates.');
      }
    };

    fetchExchangeRates();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromRef.current && !fromRef.current.contains(event.target)) setIsFromOpen(false);
      if (toRef.current && !toRef.current.contains(event.target)) setIsToOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currencies = Object.keys(exchangeRates).filter(curr => exchangeRates[curr]?.price);

  const handleSwap = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount greater than 0.');
      setLoading(false);
      return;
    }

    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
      setError('Exchange rate not available for selected currencies.');
      setLoading(false);
      return;
    }

    const fromRate = exchangeRates[fromCurrency].price;
    const toRate = exchangeRates[toCurrency].price;
    console.log(`From Rate (${fromCurrency}): ${fromRate}, To Rate (${toCurrency}): ${toRate}`);

    setTimeout(() => {
      const converted = (amountNum / toRate) * fromRate;
      setResult(`${amountNum} ${fromCurrency} = ${converted.toFixed(6)} ${toCurrency}`);
      setLoading(false);
    }, 1000);
  };

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const handleSwapIconClick = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    handleSwap({ preventDefault: () => { } });
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen flex items-center justify-center transition-colors duration-300">
        <div className={`w-full max-w-md p-6 rounded-xl shadow-xl ${isDarkMode ? 'bg-[#1e2a47] text-white' : 'bg-white text-black'} transition-colors duration-300`}>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Token Swap</h1>
            <button
              onClick={toggleTheme}
              className="p-2 ml-2 rounded-full bg-yellow-400 text-gray-900 hover:bg-yellow-500 focus:outline-none transition-all duration-300 flex items-center justify-center w-10 h-10"
              title="Toggle Theme"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>

          <form onSubmit={handleSwap} className="space-y-4">
            {/* From Currency Dropdown */}
            <div ref={fromRef}>
              <label className="block text-sm font-medium text-gray-400">From</label>
              <div className="mt-1 relative">
                <button
                  type="button"
                  onClick={() => setIsFromOpen(!isFromOpen)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white flex items-center justify-between focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                >
                  <CurrencyIcon currency={fromCurrency} />
                  <span className="ml-2">{fromCurrency}</span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isFromOpen && (
                  <div className="absolute w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                    {currencies.map(curr => (
                      <button
                        key={curr}
                        onClick={() => {
                          setFromCurrency(curr);
                          setIsFromOpen(false);
                        }}
                        className="flex items-center w-full p-2 text-left cursor-pointer hover:bg-gray-700"
                      >
                        <CurrencyIcon currency={curr} />
                        <span className="ml-2 text-white">{curr}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Swap Icon */}
            <div className="flex justify-center">
              <button
                onClick={handleSwapIconClick}
                className="bg-gray-700 rounded-full p-2 border-2 border-gray-900 text-white hover:bg-gray-600 hover:rotate-180 transition-all duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16V4m0 12l-4-4m4 4l4-4m6 8v-12m0 12l-4-4m4 4l4-4"
                  />
                </svg>
              </button>
            </div>

            {/* To Currency Dropdown */}
            <div ref={toRef}>
              <label className="block text-sm font-medium text-gray-400">To</label>
              <div className="mt-1 relative">
                <button
                  type="button"
                  onClick={() => setIsToOpen(!isToOpen)}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white flex items-center justify-between focus:outline-none focus:border-cyan-400 transition-colors duration-300"
                >
                  <CurrencyIcon currency={toCurrency} />
                  <span className="ml-2">{toCurrency}</span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isToOpen && (
                  <div className="absolute w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                    {currencies.map(curr => (
                      <button
                        key={curr}
                        onClick={() => {
                          setToCurrency(curr);
                          setIsToOpen(false);
                        }}
                        className="flex items-center w-full p-2 text-left cursor-pointer hover:bg-gray-700"
                      >
                        <CurrencyIcon currency={curr} />
                        <span className="ml-2 text-white">{curr}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-gray-400">Amount</label>
              <input
                type="number"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="mt-1 block w-full p-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors duration-300 text-white"
                placeholder="Enter amount"
                disabled={!currencies.length}
              />
            </div>

            {/* Display status messages */}
            {error && (
              <div className={`border border-red-500 rounded-lg p-2 mt-2 ${isDarkMode ? 'bg-gray-700' : 'bg-red-200'}`}>
                <p className={`font-bold text-sm text-center ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>{error}</p>
              </div>
            )}
            {result && <p className={`text-green-400 text-sm text-center ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{result}</p>}

            {/* Swap Button */}
            <button
              type="submit"
              disabled={loading || !currencies.length}
              className={`w-full py-2 px-4 rounded-lg text-white font-bold hover:opacity-90 transition-all duration-300 ${loading || !currencies.length ? 'bg-gray-500' : isDarkMode ? 'bg-gradient-to-r from-teal-500 to-cyan-400' : 'bg-gradient-to-r from-emerald-600 to-teal-600'}`}
            >
              {loading ? 'Swapping...' : 'Swap'}
            </button>

            {/* Data source info */}
            <p className="text-gray-500 text-xs text-center">
              Token data from{' '}
              <a href="https://interview.switcheo.com/prices.json" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
                Switcheo API
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;