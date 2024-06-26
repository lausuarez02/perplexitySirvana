"use client"
import React,{ useState, useMemo, useEffect,useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import {useSearch} from '../../context'
import {decompressHtml, escapeHtml} from '../../utils/utils'

async function fetchProductDetails(query: string) {
  try {
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

type ResponseType = {
  responseStream?: {
    products: string;
    answer: string
  };
  productText?:string
  // Add other properties from your response object
}


const Page = () => {
  const [inputValue, setInputValue] = useState('');
  const [querySearch, setQuerySearch] = useState('');
  const [response, setResponse] = useState<ResponseType>({});
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState('');

  const {searchResults, setSearchResults}  = useSearch();
  const inputValueRef = useRef(null)

  useEffect(() => {
    if (searchResults) {
      const formattedResponse: ResponseType = {
        productText: searchResults,
      };

      if(formattedResponse.productText){
        console.log("checkout this dude",formattedResponse.productText)
        setResponse(formattedResponse.productText as ResponseType)
      }
    
    }

    return () => {
      setSearchResults('')
    }
  }, [searchResults]);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setQuerySearch(query);
    const result = await fetchProductDetails(query);
    setResponse(result);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputValueRef.current) {
      handleSearch((inputValueRef.current as any).value);
    }
  };

  const handleProductContent = (htmlContent: string) => {
    if (!htmlContent) return ''; // Handle null or undefined case
    // Decompress HTML content if necessary
    const decompressedHtml = decompressHtml(htmlContent);
    // Escape HTML for safe rendering in React
    const escapedHtml = escapeHtml(decompressedHtml);
    let e = document.createElement('div');
    e.innerHTML = escapedHtml;
    return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
  };
  return (
    <div className="mx-auto h-full max-w-threadWidth px-md md:px-lg max-w-[100vw]">
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="transition-all duration-500 flex items-center gap-2 w-full mb-4">
        {loading && <div className="loader"></div>}
        <div className="max-w-none prose prose-sm prose-a:text-primary text-primary font-medium text-xl sm:text-2xl">
          <p className="text-gray-700">{querySearch}</p>
        </div>
      </div>
      <div className="flex flex-col mb-4">
        <div className="flex gap-2 items-center mb-1">
          <p className="text-gray-700">Respuesta</p>
        </div>
        <div className="max-w-none prose prose-sm prose-a:text-primary font-medium text-base w-full">
          <p className="text-gray-700">{response.responseStream?.answer}</p>
        </div>
      </div>
        {response.responseStream && (
                  <div dangerouslySetInnerHTML={{ __html: handleProductContent(response.responseStream.products) as string,
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full"/>
        )}
    </div>

    {/* Search bar fixed to bottom */}
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg flex items-center p-4 fixed bottom-0 left-0 right-0 bg-white"
      style={{ marginLeft: 'auto', marginRight: 'auto' }} // Centering the form horizontally
    >
      <div className="relative w-full">
        <input
          type="text"
          ref={inputValueRef}
          placeholder="Search..."
          className="w-full outline-none focus:outline-none focus:ring-borderMain dark:bg-offsetDark dark:text-textMainDark dark:placeholder-textOffDark dark:border-borderMainDark dark:focus:ring-borderMainDark selection:bg-superDuper selection:text-textMain duration-200 transition-all bg-background border border-borderMain text-black focus:ring-1 placeholder-textOff shadow-sm rounded-full py-2 px-4 pr-12"
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
};

export default Page;
