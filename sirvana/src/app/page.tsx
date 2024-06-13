"use client"
import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation'

async function fetchProductDetails(query: string) {
  try {
    console.log(query,"checkout query fetchProductDetails")

    const res = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify( {query} ),
    });
    const data = await res.json();
    return data.formattedResponse;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return '';
  }
}

export default function Home() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const router = useRouter(); // Initialize useHistory hook

  const handleSearch = async (e:React.FormEvent) => {
    e.preventDefault();
    console.log(query, "checkout query front");
    
    // Fetch data and set response
    const result = await fetchProductDetails(query)
        setResponse(result);
    // Redirect to search results page with the query as a parameter
    router.push(`/products/${encodeURIComponent(query)}`);  };

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
        <div className="mt-8 grid grid-cols-2 gap-4">
          {/* Sample small boxes */}
          <div className="bg-gray-100 hover:bg-gray-200/40 border-1 border-gray-200 rounded-xl px-3 py-4 text-xs sm:text-sm font-normal h-full flex flex-col w-full shadow-sm">
            <p className='text-gray-500 font-medium'>I have to travel by motorkbike, what do u i need?</p>
          </div>
          <div className="bg-gray-100 hover:bg-gray-200/40 border-1 border-gray-200 rounded-xl px-3 py-4 text-xs sm:text-sm font-normal h-full flex flex-col w-full shadow-sm">
          <p className='text-gray-500 font-medium'>I have to travel by motorkbike, what do u i need?</p>

          </div>
          <div className="bg-gray-100 hover:bg-gray-200/40 border-1 border-gray-200 rounded-xl px-3 py-4 text-xs sm:text-sm font-normal h-full flex flex-col w-full shadow-sm">
          <p className='text-gray-500 font-medium'>I have to travel by motorkbike, what do u i need?</p>

          </div>
          <div className="bg-gray-100 hover:bg-gray-200/40 border-1 border-gray-200 rounded-xl px-3 py-4 text-xs sm:text-sm font-normal h-full flex flex-col w-full shadow-sm">
          <p className='text-gray-500 font-medium'>I have to travel by motorkbike, what do u i need?</p>

          </div>
        </div>
      </div>
    </div>
  );
}

{/* <div className='flex flex-col gap-2'>
{/* Previous divs here */}
{/* <div className='relative flex items-center transition-all duration-100 rounded-full p-0.5 bg-primary-500/40 shadow-[0_0_30px_rgb(0,67,138,0.2)]'>
  <form 
    onSubmit={handleSearch}
    className="w-full max-w-lg flex items-center p-4 md:relative md:bg-transparent shadow-md md:shadow-none"
  >
    <div className="relative flex w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full px-4 py-2 bg-transparent border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-borderMain"
      />
      <button
        type="submit"
        className="ml-2 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600 transition-all duration-200"
      >
    <FontAwesomeIcon icon={faArrowUp} />

      </button>
    </div>
  </form>
</div>
</div>  */}