
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '../components/ui/breadcrumb.jsx'
import { Link } from 'react-router-dom'
import MainCategories from '../components/MainCategories.jsx'
import FeaturedPost from '../components/FeaturedPost.jsx'
import PostList from '../components/PostList.jsx'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.jsx"



const HomePage = () => {


  return (
    <div className='mt-4 flex flex-col gap-4'>
      {/* Introduction */}
      <div className='flex justify-between items-center'>
        {/* Hero Title Section */}
        <div>
          <h1 className="text-gray-900 text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Welcome to <span className="text-blue-800">PostNest</span>
          </h1>
          <p className="mt-6 text-base md:text-xl text-gray-700 max-w-2xl">
            Read insightful posts, share your thoughts, and connect with a growing community of passionate writers and readers.
          </p>
        </div>

        {/* Animated Logo  */}
        <Tooltip >
          <TooltipTrigger asChild>
            <Link to='/write' className='hidden md:block relative '>
              <svg viewBox="0 0 200 200" width="200" height="200" className="text-lg tracking-widest animate-spin animatedButton" >
                <path id="circlePath" fill="none" d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0" />
                <text>
                  <textPath href='#circlePath' startOffset='0%'>Write your story •</textPath>
                  <textPath href='#circlePath' startOffset='50%'>Share your Idea •</textPath>
                </text>
              </svg>
              <button className='flex items-center justify-center rounded-full bg-blue-800 absolute top-0 left-0 right-0 bottom-0 m-auto w-20 h-20 cursor-pointer'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50" fill="none" stroke="white" strokeWidth="2" >
                  <line x1="6" y1="18" x2="18" y2="6" />
                  <polyline points="9 6 18 6 18 15" />
                </svg>
              </button>
            </Link>
          </TooltipTrigger>
          <TooltipContent><p className='text-base'>Create a New Blog</p></TooltipContent>
        </Tooltip>
      </div>

      {/* Categories */}
      <MainCategories />
      {/* Feature Posts */}
      <FeaturedPost />
      {/* Post Lists */}
      <div>
        <h1 className='my-8 text-2xl text-gray-600'>Recent Posts</h1>
        < PostList />

      </div>
    </div>
  )
}

export default HomePage
