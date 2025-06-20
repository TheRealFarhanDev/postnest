import React from 'react';
import { Link } from 'react-router-dom';
import Search from './Search.jsx';

const MainCategories = () => {
  return (
    <div className='hidden md:flex bg-white rounded-3xl xl:rounded-full items-center justify-center p-4 shadow-lg'>
      {/* Links */}
      <div className='flex flex-1 items-center flex-wrap justify-between'>
        <Link to='/posts' className='bg-blue-800 text-white rounded-full px-4 py-2 font-medium'>All Posts</Link>
        <Link to='/posts?cat=web-design' className='hover:bg-blue-50 rounded-full px-4 py-2 font-medium'>Web Design</Link>
        <Link to='/posts?cat=development' className='hover:bg-blue-50 rounded-full px-4 py-2 font-medium'>Development</Link>
        <Link to='/posts?cat=databases' className='hover:bg-blue-50 rounded-full px-4 py-2 font-medium'>Databases</Link>
        <Link to='/posts?cat=seo' className='hover:bg-blue-50 rounded-full px-4 py-2 font-medium'>Search Engines</Link>
        <Link to='/posts?cat=marketing' className='hover:bg-blue-50 rounded-full px-4 py-2 font-medium'>Marketing</Link>
      </div>
      {/* Separator */}
      <span className='text-xl font-medium'>|</span>
      {/* Search */}
      <Search isNavbar={true} />
    </div>
  );
};

export default MainCategories;
