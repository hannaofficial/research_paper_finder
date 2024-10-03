'use client'
import Link from 'next/link';
import React from 'react';
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import { useState } from 'react';
import axios from 'axios';
import { IoIosLink } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TbLoader2 } from "react-icons/tb";

function ResearchCard({ paper,onDelete }) {

     const [isBookmarked, setIsBookmarked] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [error, setError] = useState(null);
    
  //deleteing logic

  const handleDeleteClick = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await axios.delete(`/api/bookmark`, {
        data: { id: paper.id }
      });
  
      if (response.status === 200) {
        console.log("Paper deleted:", response.data);
        onDelete(paper.id);  
      }
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      setError(error.response?.data?.error || 'Failed to delete bookmark');
    } finally {
      setIsLoading(false);
    }
  };
  
     const handleBookmarkClick = async () => {
      setIsLoading(true);
      setError(null);
  
      try {
        const response = await axios.post('/api/bookmark', {
          paper: {
            name: paper.name,
            author: paper.author,
            published_date: paper.published_date,
            link: paper.link,
            importance: paper.importance
          }
        });
  
        if (response.status === 200) {
          setIsBookmarked(!isBookmarked);
          console.log("Paper saved:", response.data);
        }
      } catch (error) {
        console.error("Error saving bookmark:", error);
        setError(error.response?.data?.error || 'Failed to save bookmark');
        // Revert the bookmark state if there was an error
        setIsBookmarked(false);
      } finally {
        setIsLoading(false);
      }
    };



    const  truncateLetters = (text, maxLetters) =>{
        if (!text) {
          return "";
        }
      
        if (text.length <= maxLetters) {
          return text; 
        }
      
        return text.slice(0, maxLetters) + "..."; 
      } 


  return (
    <div  className="relative mb-4 p-6 text-neutral-300 border border-neutral-600 h-full   bg-[#202222]   rounded shadow-md"> 
       <div className='flex flex-col justify-between  h-full'>
            <div>
                <h3 className="font-mono font-bold text-base sm:text-lg mb-4">{paper.name}</h3>
                <div className="mt-2 text-xs sm:text-sm">
                    <p className='font-mono'><span className='font-mono font-semibold text-xs sm:text-base'>Authors:</span> {paper.author}</p>
                    <p className='font-mono '><span className='font-mono font-semibold text-xs sm:text-base'>Published:</span> {paper.published_date}</p>
                    
                    <p className='font-mono '><span className='font-mono font-semibold text-xs sm:text-base'>Overview:</span> {truncateLetters(paper.importance,300)}</p>
                    {error && (
                          <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                    
                </div>
            </div>
            <div>
                    <Link 
                    href={paper.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-neutral-500 hover:underline"
                    >
                    <div className='flex gap-2 mt-4 items-center'>

                        <IoIosLink className='w-4 h-4 text-blue-500'/> 
                        <p className='text-xs'>{truncateLetters(paper.link,20)}</p>
                    </div>
                    </Link>
                </div>
        </div>

        <div className='absolute right-2 bottom-2'>
            {paper.id ? <button 
          onClick={handleDeleteClick} disabled={isLoading}
          className={`transition-opacity ${isLoading ? 'opacity-50' : ''}`}
        >
          {isLoading?<TbLoader2 className='sm:w-6 sm:h-6 w-6 h-6'/>:<RiDeleteBin6Line className='sm:w-6 sm:h-6 w-4 h-4 text-neutral-400 hover:text-red-400' />}
          

        </button>:<button 
              onClick={handleBookmarkClick} 
              disabled={isLoading}
              className={`transition-opacity ${isLoading ? 'opacity-50' : ''}`}
            >
              {isBookmarked ? (
                <GoBookmarkFill className='sm:w-6 sm:h-6 w-4 h-4 text-blue-400' />
              ) : (
                <GoBookmark className='sm:w-6 sm:h-6 w-4 h-4 hover:text-blue-400' />
              )}
            </button>}
      </div>
    </div>
    
  );
}

export default ResearchCard;