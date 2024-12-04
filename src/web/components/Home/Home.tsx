import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store/store';
import { TradeAccountsUseCase } from '../../../application/useCases/Trading/tradeAccountsUseCase';
import { setTradeResults, setExecuting, setError } from '../../../store/slices/tradeSlice';
import { BingXAccountService } from '../../../application/services/bingxAccountService';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const { results: tradeResults, isExecuting, error } = useSelector(
    (state: RootState) => state.trade
  );

  const handleExecuteTrades = async () => {
    dispatch(setExecuting(true));
    dispatch(setError(null));
    try {
      const accountService = BingXAccountService.getInstance();
      console.log(accountService);
      const tradeUseCase = new TradeAccountsUseCase(accountService);
      const results = await tradeUseCase.execute();
      dispatch(setTradeResults(results as any[]));
    } catch (err) {
      dispatch(setError(err instanceof Error ? err.message : 'An error occurred'));
    } finally {
      dispatch(setExecuting(false));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">BingX Accounts</h1>
      

      {/* Execute Button */}
      <div className="mb-4">
        <button 
          onClick={handleExecuteTrades}
          disabled={isExecuting}
          className={`
            px-4 py-2 rounded
            ${isExecuting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
            }
            text-white font-medium
            transition-colors
          `}
        >
          {isExecuting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Executing Trades...
            </span>
          ) : (
            'Execute Trades'
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 mb-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {/* Trade Results */}
      {tradeResults.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-3">Trade Results</h2>
          <ul className="space-y-3">
            {tradeResults.map((result: any, index: number) => (
              <li key={index} className={`p-3 rounded ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="font-medium">Account: {result.account}</p>
                <p className={`${result.success ? 'text-green-600' : 'text-red-600'}`}>
                  Status: {result.success ? 'Success' : 'Failed'}
                </p>
                {result.error && (
                  <p className="text-red-600 text-sm mt-1">
                    Error: {result.error}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home; 