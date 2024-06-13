'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';


async function fetchProductDetails(query: string) {
  try {
    console.log(query,"checkout query fetchProductDetails")

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( query ),
    });
    const data = await res.json();
    return data.formattedResponse;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return '';
  }
}

export const Page = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(query,"checkout query front")
    const result = await fetchProductDetails(query);
    setResponse(result);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
    <div className="flex-grow flex items-center justify-center">
      <div dangerouslySetInnerHTML={{ __html: response }} className="w-full max-w-2xl" />
    </div>
    <form 
      onSubmit={handleSearch}
      className="w-full max-w-lg flex items-center p-4 fixed bottom-0 md:relative md:bottom-auto md:bg-transparent shadow-md md:shadow-none"
    >
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="items-center flex w-full outline-none focus:outline-none focus:ring-borderMain font-sans dark:bg-offsetDark dark:text-textMainDark dark:placeholder-textOffDark dark:border-borderMainDark dark:focus:ring-borderMainDark selection:bg-superDuper selection:text-textMain duration-200 transition-all bg-background border text-black border-borderMain focus:ring-1 placeholder-textOff shadow-sm rounded-full py-2 px-4 pr-12"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600 transition-all duration-200"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      </div>
    </form>
  </div>
  );
}

export default Page;
