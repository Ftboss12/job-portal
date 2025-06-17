import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        if (query.trim()) {
            dispatch(setSearchedQuery(query));
            navigate('/browse');
        }
    };

    return (
        <div className="text-center bg-gradient-to-b from-white to-gray-50 py-20">
            <div className="flex flex-col gap-5 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
               
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                    Shape Your Future with the <br />
                    <span className="text-[#4F46E5]">Right Career Move</span>
                </h1>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    Explore career-defining opportunities with leading companies. Your journey to success begins now!
                </p>

                {/* Search Bar Container */}
                <div className="flex flex-col items-center w-full max-w-2xl mx-auto mt-8">
                    <div className="flex w-full bg-white shadow-lg border border-gray-200 rounded-full overflow-hidden">
                        <input
                            type="text"
                            placeholder="Search jobs, companies, or keywords"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="outline-none border-none w-full py-1.5 text-lg px-5 focus:ring-2 focus:ring-[#4F46E5] placeholder:text-gray-400"
                        />
                        <Button
                            onClick={searchJobHandler}
                            className="bg-[#4F46E5] hover:bg-[#4338CA] transition-colors text-white h-full px-6 py-3 flex items-center justify-center rounded-r-full"
                        >
                            {/* Ensuring the search icon fits properly */}
                            <Search className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Popular Jobs Section */}
                <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
                    <span>Popular:</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setQuery('Software Engineer');
                                searchJobHandler();
                            }}
                            className="hover:text-[#4F46E5] transition-colors"
                        >
                            Software Engineer
                        </button>
                        <button
                            onClick={() => {
                                setQuery('Product Manager');
                                searchJobHandler();
                            }}
                            className="hover:text-[#4F46E5] transition-colors"
                        >
                            Product Manager
                        </button>
                        <button
                            onClick={() => {
                                setQuery('Data Scientist');
                                searchJobHandler();
                            }}
                            className="hover:text-[#4F46E5] transition-colors"
                        >
                            Data Scientist
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
