import React from 'react'
import { Link } from 'react-router-dom'
import whiteArrowIcon from '../assets/white_arrow_icon.svg'
import blackArrowIcon from '../assets/black_arrow_icon.svg'
import bannerVideo from '../assets/banner.webm';

const MainBanner = () => {
  return (
    <div className='relative h-screen overflow-hidden'>
      <video
        src={bannerVideo}
        autoPlay
        loop
        muted
        className='w-full h-screen hidden md:block object-cover'
      >
        Your browser does not support the video tag.
      </video>

      <video
        src={bannerVideo}
        autoPlay
        loop
        muted
        className='w-full h-full md:hidden object-cover'
      >
        Your browser does not support the video tag.
      </video>

      <div className='absolute inset-0 flex items-center p-6 md:px-12 lg:px-24'>
        <div className='flex flex-col items-start'>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-left max-w-xl leading-tight lg:leading-15 text-white mb-6">
            Dealers You Can Trust, Benefits You will Love!
          </h1>

          <div className='flex items-center font-medium gap-4'>
            <div className='group flex items-center gap-2 px-7 md:px-9 py-3 bg-green-500 hover:bg-green-600 transition rounded text-white cursor-pointer' onClick={() => document.getElementById('featured-products').scrollIntoView({ behavior: 'smooth' })}>
              Shop Now
              <img className='md:hidden transition group-focus:translate-x-1' src={whiteArrowIcon} alt="arrow" />
            </div>

            <Link to={"/accessories"} className='text-black group hidden md:flex items-center gap-2 px-9 py-3 bg-primary hover:bg-primary-dull transition rounded text-white cursor-pointer'>Explore Deals
              <img className='transition group-focus:translate-x-1' src={blackArrowIcon} alt="arrow" /></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default MainBanner