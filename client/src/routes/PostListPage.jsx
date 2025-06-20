import { useState } from "react";
import PostList from "../components/PostList.jsx"
import SideMenu from '../components/SideMenu.jsx'

const PostListPage = () => {
  const [open, setOpen]= useState(false);

  return (
    <div className=''>
      <h1 className='mb-8 mt-2 text-2xl font-semibold'>All Blogs</h1>
      <button className='text-xl bg-blue-800 px-4 py-2 rounded-xl mb-4 text-white shadow-md md:hidden' onClick={()=>setOpen((prev)=>!prev)}>
        {open ? "Close" : "Search or Filter"}
        </button>
      <div className='flex flex-col-reverse gap-8 md:flex-row'>
        <div className='w-4/5'>
          <PostList />
        </div>
        <div className="md:block hidden bg-gray-300 w-px "></div>
        <div className={`${open ? "block" : "hidden"} md:block w-1/5`}>
          <SideMenu />
        </div>
      </div>
    </div>
  )
}

export default PostListPage
