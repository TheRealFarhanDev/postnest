
import { Button } from './ui/button'
import { useState, useEffect } from 'react'
import Image from './Image';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, useAuth, UserButton } from '@clerk/clerk-react';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const {getToken} = useAuth();
  useEffect(() => {
    getToken()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setOpen(false);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <div className='flex justify-between items-center w-full h-16'>
      {/* LOGO  */}
      <Link to='/' className='flex items-center justify-center gap-1.5 cursor-pointer text-3xl font-semibold'>
        <Image src='logo.png' alt='Logo' w={48} h={48} />
        <span className='text-slate-700'>PostNest</span>
      </Link>
      {/* Mobile Menu  */}
      {/* Mobile Button */}
      <div className='md:hidden'>
        <Button className="text-xl md:hidden" onClick={() => setOpen(prev => !prev)}>
          {open ? 'X' : '☰'}
        </Button>
      </div>
      {/* Mobile LInk List  */}
      <div
        className={`md:hidden fixed top-16 left-0 w-full h-screen soft-gradient z-10 transition-transform duration-300 ease-in-out transform ${open && isMobile ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex flex-col justify-center items-center gap-8 text-lg font-medium h-full">
          <Link to="/"  onClick={() => setOpen(false)}>Home</Link>
          <Link to="/posts?sort=trending" onClick={() => setOpen(false)}>Trending</Link>
          <Link to="/posts?sort=popular" onClick={() => setOpen(false)}>Most Popular</Link>
          <SignedOut>
            <Button onClick={() => setOpen(false)}>
              <Link to="/login">Login</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      {/* Desktop Menu  */}
      <div className='hidden md:flex items-center gap-8 xl:gap-10 font-medium '>
        <Link className='hover:translate-y-1 transition duration-300' to='/'>Home</Link>
        <Link className='hover:translate-y-1 transition duration-300' to='/posts?sort=trending'>Trending</Link>
        <Link className='hover:translate-y-1 transition duration-300' to='/posts?sort=popular'>Most Popular</Link>
        <SignedOut>
          <Button>
            <Link to='/login'>Login</Link>
          </Button>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  )
}

export default Navbar
