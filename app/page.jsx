'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi';
import ResearchCard from './components/researchCard';
import { useRouter } from 'next/navigation';



import Skeleton from 'react-loading-skeleton';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import Link from 'next/link';

const DEFAULT_QUESTION = "";

export default function Home() {
  const [question, setQuestion] = useState(DEFAULT_QUESTION);
  const [answer, setAnswer] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormShifted, setIsFormShifted] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const resetToDefault = () => {
    setQuestion(DEFAULT_QUESTION);
  };

  const router = useRouter(); 
  const handleGoHome = (e) => {
    e.preventDefault()
    router.push('/'); 
  };

  useEffect(() => {
    if (answer) {
      setTimeout(() => setShowAnswers(true), 100); 
    }
  }, [answer]);

  const toggleFormPosition = () => {
    setIsLoading(!isLoading);
    setIsFormShifted(!isFormShifted); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsFormShifted(true)
    setError(null);
    setAnswer(null);

    try {
      const response = await axios.post('/api/ask', { question }, {
        timeout: 180000 // 2 minutes
      });
      setAnswer(response.data.answer);
    } catch (error) {
      console.error('Error:', error);
      if (error.code === 'ECONNABORTED') {
        setError(new Error('The request took too long to complete. Please try again or refine your search.'));
      } else if (error.response?.status === 504) {
        setError(new Error('The server took too long to respond. Please try again later.'));
      } else {
        setError(new Error(error.response?.data?.error || 'An error occurred while fetching the answer.'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className='text-base sm:text-2xl font-mono flex flex-col mx-auto text-center justify-center items-center min-h-screen w-[80%]'>
        <p>{error.message}</p>
        <p>The Gemini model API might be experiencing high traffic. Please try again later or refine your search query.</p>
        <div className='flex justify-center items-center mt-4'>
          <button onClick={() => setError(null)} className='text-blue-600 hover:underline mr-4'>
            Try Again
          </button>
          
        </div>
      </div>
    );
  }
  

  

  return (
    <div
    className={`relative container overflow-y-auto mx-auto min-h-screen p-4 flex flex-col items-center transition-all duration-500 ease-in-out`}
    style={{
      marginTop: isFormShifted ? '0' : '20vh', 
      transitionProperty: 'margin-top', 
    }}
  >
      <SkeletonTheme baseColor='#242323' highlightColor='#323232'>
      
      <div
        className={`max-w-[60%] flex flex-col ${isFormShifted ? 'mt-6' : 'mt-40'} items-center transition-all duration-500 ease-in-out`}
        style={{ transitionProperty: 'margin-top' }}
      >
            <h1 className="text-xl sm:text-3xl font-medium mb-8 tracking-wider">Start by searching a topic</h1>
              <form onSubmit={handleSubmit} className="mb-4">
                  
                    <div className="relative">
                      <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ex: Transformer"
                        className=" w-[16rem]  sm:w-[24rem] md:w-[40rem] lg:w-[50rem] p-4 pr-12 h-10 sm:h-14 text-neutral-300  bg-[#202222] border border-gray-600 rounded-md outline-none focus:ring-1 focus:ring-neutral-300 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 ">
                        <button
                        type='submit'
                        className="bg-transparent"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          '...'
                        ) : (
                          <>
                            <FiSearch className="w-6 h-6 mr-1 text-gray-400 hover:text-blue-400 transition-all duration-300 ease-in-out" /> 
                          </>
                        )}
                      </button>
                          
                      </div>
                    </div>
                    
                  
              </form>
             
            </div>


           
              {isLoading && (
                
                <div className={`flex flex-col justify-center items-center gap-6  w-1/2 sm:w-full ${isLoading ? 'opacity-1 visible' : 'opacity-0 hidden'} transition-opacity duration-500 ease-in-out`} style={{transitionProperty:'visibility'}}>
                      <div className='grid gap-6 '>
                          <div className='  rounded-md'>
                            <Skeleton height={180} width={1200}  />
                          </div>
                          <div className='  rounded-md'>
                            <Skeleton height={180} width={1200}  />
                          </div>
                          <div className='rounded-md'>
                            <Skeleton height={180} width={1200}  />
                          </div>
                    </div>
                 
                </div>
                   
                   
               
      ) }

            
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}
            {answer && (
      <div className="mt-10 w-4/5 h-full mx-auto">
        <h2 className={`text-sm sm:text-xl font-mono mb-6 ${showAnswers ? 'opacity-100':'opacity-0'} transition-all duration-500 ease-out`} style={{
                  transitionProperty:'opacity', 
                }}>
          {answer.error ? '' : 'No of paper is limited to 1-2 because of high response time from the model:'}
        </h2>
        <p className="font-mono flex justify-center">
          {answer.error ? answer.error : ''}
        </p>
        <div className=" gap-6   mx-auto">
          {Array.isArray(answer) ? (
            answer.map((paper, index) => (
              <div
                key={index}
                className={`mb-4 p-2 rounded ${showAnswers ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} transition-all duration-500 ease-out delay-[${index * 150}ms]`} 
                style={{
                  transitionDelay: `${index * 150}ms`, 
                }}
              >
                <ResearchCard paper={paper} />
              </div>
            ))
          ) : answer.error ? (
            <p></p>
          ) : (
            <p className="p-4 bg-gray-100 rounded">Unexpected response format</p>
          )}
        </div>
      </div>
    )}
            </SkeletonTheme>
    </div>
  );
}