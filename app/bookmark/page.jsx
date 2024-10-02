'use client'
import { useEffect, useState } from 'react';
import axios from 'axios'; 
import ResearchCard from '../components/researchCard';
import { ImSpinner2 } from "react-icons/im";

export default function BookmarkList() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const fetchBookmarks = async () => {
      try {
        const response = await axios.get('/api/bookmark'); 

        if (response.status === 200) {
          setBookmarks(response.data.bookmarks); 
        } else {
          setError(response.data.error || 'Failed to fetch bookmarks');
        }
      } catch (err) {
        setError('Error fetching bookmarks');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);


  const handleDelete = (id) => {
    
    setBookmarks(prevBookmarks => prevBookmarks.filter(bookmark => bookmark.id !== id));
    toast.success('Bookmark deleted successfully');
  };

  
  if (error) return <div>Error: {error}</div>;
  if (loading) return <div className='flex justify-center items-center min-h-screen'><ImSpinner2 className='w-12 h-12 animate-spin text-neutral-400'/></div>
  return (
    <div className='flex flex-col items-center justify-center max-w-[100%] sm:max-w-[70%]  mx-auto mt-20'>
      {bookmarks.length >0 && <h1 className='text-2xl mb-8'>Your saved bookmarks</h1>}
    {bookmarks.length == 0 ?<h1 className='text-xl sm:text-2xl mb-8 flex justify-center items-center'>Your saved no bookmarks</h1>:<div className=" gap-6  w-full">
          {
            bookmarks.map((bookmark, index) => (
              <div
                key={bookmark.id}
                className={`mb-4 p-2 rounded w-5/6 mx-auto  transition-all duration-500 ease-out delay-[${index * 150}ms]`} 
                style={{
                  transitionDelay: `${index * 150}ms`, 
                }}
              >
                <ResearchCard paper={bookmark} onDelete={handleDelete}/>
              </div>
            ))
         }
        </div>}
      
      
    </div>
  );
}
