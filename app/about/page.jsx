import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Logo from '@/public/assets/ownerPic.jpeg'

const AboutPage = () => {
  return (
    <div className='min-h-screen flex flex-col gap-6 justify-center items-center'>
      <Image src={Logo} alt='profile-pic' height={200} width={200} className='rounded-full w-16 h-16 sm:w-24 sm:h-24 border hover:border-green-600 hover:-translate-y-10 transition-all duration-500 ease-linear shadow-lg' priority/>
      <p className='text-xl sm:text-4xl font-mono font-medium text-neutral-400 mx-4 text-center'>Hi I am Hanna. This website is in developing phase.<br/> my github: <Link href='https://github.com/hannaofficial' target='_blank' className='text-[#2478c1] underline hover:text-green-800'>@hannaofficial</Link> </p>
      
    </div>
  )
}

export default AboutPage
