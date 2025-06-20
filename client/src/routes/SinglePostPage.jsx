import Image from "../components/Image"
import { Link, useParams } from 'react-router-dom'
import PostMenuActons from '../components/PostMenuActions'
import Search from '../components/Search'
import Comments from '../components/Comments'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import Loader from '../components/Loader'
import { formatDistanceToNow } from "date-fns"
import parse from "html-react-parser"

const fetchPost = async (slug) => {
  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${slug}`);
  return res.data;
}

const SinglePostPage = () => {
  const { slug } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug)
  })

  if (isPending) return <Loader />
  if (error) return "Something went wrong" + error.message
  if (!data) return "Page Not Found!"



  return (
    <div className='flex flex-col gap-8 mt-3'>
      {/* detail  */}
      <div className="flex flex-col lg:flex-row gap-8 w-full justify-between">
        {/* Left: Post Content */}
        <div className="lg:w-3/5 flex flex-col gap-4 md:gap-8">
          <h1 className="text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-semibold">
            {data.title}
          </h1>
          <div className="flex items-center flex-wrap gap-2 text-gray-400 text-sm">
            <span>Written by</span>
            <Link className="text-blue-800">{data.user.username}</Link>
            <span>on</span>
            <Link className="text-blue-800">{data.category}</Link>
            <span>{formatDistanceToNow(new Date(data.createdAt), { addSuffix: true })}</span>
          </div>
          <p className="text-gray-500 font-medium">{data.desc}</p>
        </div>

        {/* Right: Cover Image */}
        {data.img && (
          <div className="lg:w-2/5 flex justify-center lg:justify-end">
            <Image
              src={data.img}
              w={600}
              h={300}
              alt={data.title}
              className="rounded-2xl object-cover w-full max-h-[300px]"
            />
          </div>
        )}
      </div>
      {/* content  */}
      <div className='flex flex-col md:flex-row gap-4'>
        {/* text  */}
        <div className='prose content lg:text-lg flex flex-col gap-6 text-justify md:w-4/5'>
          {parse(data.content)}
        </div>
        {/* Divider  */}
        <div className='hidden md:block w-px bg-gray-500 rounded-full'></div>
        {/* menu  */}
        <div className='px-2 h-max sticky top-8 md:w-1/5'>
          <div className='flex flex-col gap-3'>
            <h1 className='mb-1 text-sm  font-semibold'>Author</h1>
            <div className='flex items-center gap-4'>
              {data.user.img && <img src={data.user.img || "https://img.clerk.com/eyJ0eXBlIjoiZGVmYXVsdCIsImlpZCI6Imluc18yd2RoZEp1N0JPN0NFSmNmaXdiaHlBeU5VTDMiLCJyaWQiOiJ1c2VyXzJ4cnFyOW5lUFlqdjJ1b0pMd0JRcmlkcFQzRCIsImluaXRpYWxzIjoiUyJ9?width=160"} className="w-10 h-10 rounded-full object-cover" w={48} h={48} loading="lazy" />}
              <Link className='font-medium '>{data.user.username}</Link>
            </div>
            <p className='text-sm text-gray-500'>Update User Description in User Settings</p>
            <div className='flex gap-2'>
              <Link>
                <Image src="facebook.svg" />
              </Link>
              <Link>
                <Image src="instagram.svg" />
              </Link>
            </div>
          </div>
          <PostMenuActons post={data} />
          <h1 className='mt-8 mb-4 text-sm  font-semibold'>Categories</h1>
          <div className='flex flex-col gap-2 text-sm'>
            <Link to='/' className='underline'>All</Link>
            <Link to='/' className='underline'>Web Design</Link>
            <Link to='/' className='underline'>Development</Link>
            <Link to='/' className='underline'>Databases</Link>
            <Link to='/' className='underline'>Search Engines</Link>
            <Link to='/' className='underline'>Marketing</Link>
          </div>
          <h1 className='mt-6 mb-3 text-sm  font-semibold'>Search</h1>
          <Search />
        </div>
      </div>
      <Comments postId={data._id} />
    </div>
  )
}

export default SinglePostPage
