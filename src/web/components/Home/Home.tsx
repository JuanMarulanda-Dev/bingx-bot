import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

const Home: React.FC = () => {
  const bingxAccounts = useSelector((state: RootState) => state.bingxAccounts.accounts);

  return (
    <div>
      <h1>Home</h1>
      <ul>
        {bingxAccounts.map((account, index) => (
          <li key={index}>
            <p>Owner: {account.owner}</p>
            <p>API Key: {account.apiKey}</p>
            <p>Secret Key: {account.secretKey}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home; 