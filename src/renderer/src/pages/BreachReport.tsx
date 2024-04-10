// BreachReport.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

interface Breach {
  name: string;
  domain: string;
  breachDate: string;
  pwnCount: number;
}

const BreachReport = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [breaches, setBreaches] = useState<Breach[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Make an API call to check for breaches associated with the email
      const response = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}`);

      if (response.ok) {
        const data: Breach[] = await response.json();
        setBreaches(data);
      } else {
        setError('No breaches found for the provided email.');
      }
    } catch (error) {
        console.log(error)
      setError('An error occurred while fetching the breach report.');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="bg-zinc-900 py-4">
        <div className="container mx-auto px-4">
          <Link to="/dashboard" className="flex items-center text-white hover:text-lime-300">
            <FiArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold mt-4">Breach Report</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-center">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="w-full px-4 py-2 rounded-l bg-zinc-800 text-white focus:outline-none"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-lime-300 hover:bg-lime-500 text-black font-bold rounded-r"
            >
              Check Breaches
            </button>
          </div>
        </form>
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : breaches.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold mb-4">Breaches Found:</h2>
            <ul>
              {breaches.map((breach, index) => (
                <li key={index} className="mb-4">
                  <h3 className="text-lg font-bold">{breach.name}</h3>
                  <p>Domain: {breach.domain}</p>
                  <p>Breach Date: {breach.breachDate}</p>
                  <p>Pwned Accounts: {breach.pwnCount}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No breaches found for the provided email.</p>
        )}
      </main>
    </div>
  );
};

export default BreachReport;
