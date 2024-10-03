"use client"

import React from 'react';
import { GoBookmark } from "react-icons/go";
import { RiHome2Line } from "react-icons/ri";
import { TbCameraSelfie } from "react-icons/tb";
import { IoArrowBack } from "react-icons/io5";

import { useSidebar } from './Globalcontext';
import Link from 'next/link';
import { GrLinkNext } from 'react-icons/gr';

const Sidebar = () => {
    const sidebarContext = useSidebar();
    const { isSidebarVisible, toggleSidebar } = sidebarContext;

    if (!sidebarContext) {
        return null; 
    }

    return (
        
        <div className={` sticky top-0 min-h-screen w-1/6  h-full overflow-hidden  transition-all duration-800 ease-in-out ${isSidebarVisible ? 'translate-x-0 w-1/6   sm:bg-[#202222] border-r sm:border-b sm:border-neutral-600 border-transparent' : 'translate-x-[-25%] sm:border-r sm:bg-[#1b1d1d] sm:border-neutral-800 w-[4rem] border-transparent'}`}> 
            <div className=' justify-end pt-4 hidden sm:flex text-neutral-400 '>
                <button onClick={toggleSidebar} className='transition-all duration-700 ease-in-out'>
                    {isSidebarVisible?<IoArrowBack className='w-8 h-8 mr-4'/>:<GrLinkNext className='w-6 h-6 mr-4'/>}
                    
                </button>
            </div>
            
            
                <div className='flex flex-col justify-evenly ml-6 mt-6 h-full  '>
                <Link href='/'>
                    <p className='font-medium text-base lg:text-xl mx-1 sm:mx-0 text-neutral-400 flex gap-0 sm:gap-2 lg:gap-8 mb-4 items-center hover:text-blue-400 transition-all duration-300 '>
                        
                          <span><RiHome2Line className='w-6 h-6 sm:w-6 sm:h-6'/></span><span className='hidden sm:block'>Home</span>
                        
                    </p>
                    </Link>
                    <Link href='/bookmark'>
                        <p className='font-medium text-base lg:text-xl mx-1 sm:mx-0 text-neutral-400 flex  gap-0 sm:gap-2 lg:gap-8 mb-4 items-center hover:text-blue-400 transition-all duration-300'>
                        
                            <span><GoBookmark className='w-6 h-6 sm:w-6 sm:h-6'/></span><span className='hidden sm:block'>Bookmark</span>
                            
                        </p>
                    </Link>
                    <Link href='/about'>
                        <p className='font-medium text-base lg:text-xl mx-1 sm:mx-0 text-neutral-400 flex gap-0 sm:gap-2 lg:gap-8 items-center hover:text-blue-400 transition-all duration-300'>
                        
                            <span><TbCameraSelfie className='w-6 h-6 sm:w-6 sm:h-6'/></span><span className='hidden sm:block'>About</span>
                            
                        </p>
                    </Link>
                </div>
            
        </div>
        
    );
};

export default Sidebar;