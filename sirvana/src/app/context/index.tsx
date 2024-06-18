"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Connection } from 'mongoose'; // Import mongoose Connection type

type ResponseType = {
  responseStream?: {
    products: string;
    answer: string
    // Add other properties if necessary
  };
  productText?: string;
  // Add other properties from your response object
};

type SearchContextType = {
  searchResults: string;
  setSearchResults: React.Dispatch<React.SetStateAction<string>>;
  client?: Connection; // Optional mongoose Connection
  response: ResponseType; // Response object from API
};

const SearchContext = createContext<SearchContextType>({
  searchResults: '',
  setSearchResults: () => {},
  response: {}, // Initial response object
});

type SearchProviderProps = {
  client?: Connection;
  children: ReactNode; // ReactNode allows any React node as children
};

export const SearchProvider: React.FC<SearchProviderProps> = ({ client, children }) => {
  const [searchResults, setSearchResults] = useState('');
  const [response, setResponse] = useState<ResponseType>({});

  return (
    <SearchContext.Provider value={{ searchResults, setSearchResults, client, response }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
