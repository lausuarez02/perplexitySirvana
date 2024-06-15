"use client"
import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation'
import {SearchProvider, useSearch} from './context'

async function fetchProductDetails(query:string) {
  try {
    console.log(query, "checkout query fetchProductDetails");

    const res = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return '';
  }
}

export default function Home() {
  const [query, setQuery] = useState('');
  // const [response, setResponse] = useState('');
  const router = useRouter(); // Initialize useHistory hook
  const { setSearchResults } = useSearch();
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e:React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log(query, "checkout query front");
    const result = await fetchProductDetails(query)
    setSearchResults(result);
    router.push( `/search/${encodeURIComponent(query)}`
    );
    setLoading(false);
   };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-4xl p-6 bg-white dark:bg-offsetDark">
        <h1 className="text-5xl text-black font-semibold text-center mb-6">Sirvana</h1>
        <div className='flex flex-col gap-2'>
          <div className='relative flex items-center transition-all duration-100 rounded-full p-0.5 bg-primary-500/40 shadow-[0_0_30px_rgb(0,67,138,0.2)]'>
            <div className='group flex flex-col w-full'>
            <form 
    onSubmit={handleSearch}
  >
              <div className="relative w-full inline-flex shadow-sm rounded-full bg-gray-100 p-0 cursor-text border-[2px] border-primary">
                <div className="w-full h-full bg-gray-100 rounded-full py-2 px-5 flex items-center ">
                {loading && <div className="loader"></div>}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 14L16.5 16.5M16.4333 18.5252C15.8556 17.9475 15.8556 17.0109 16.4333 16.4333C17.0109 15.8556 17.9475 15.8556 18.5252 16.4333L21.5667 19.4748C22.1444 20.0525 22.1444 20.9891 21.5667 21.5667C20.9891 22.1444 20.0525 22.1444 19.4748 21.5667L16.4333 18.5252ZM16 9C16 5.13401 12.866 2 9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16C12.866 16 16 12.866 16 9Z" />
                  </svg>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar..."
                    className="bg-transparent ml-2 w-full text-gray-900 text-sm focus:outline-none p-1.5"
                  />
                </div>
              </div>
              <button
        type="submit"
        className="absolute right-3 top-2 flex items-center justify-center bg-blue-500 text-white rounded-full w-10 h-10 hover:bg-blue-600 transition-all duration-200"
      >
                <FontAwesomeIcon icon={faArrowUp} />
                </button>
                </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
