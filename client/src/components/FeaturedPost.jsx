import axios from 'axios';
import Image from './Image';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Loader from './Loader';
import { formatDistanceToNow } from "date-fns"

const fetchFeaturedPosts = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts?featured=true&limit=4`);
    return res.data.posts;
};

const FeaturedPost = () => {
    const { isPending, error, data } = useQuery({
        queryKey: ["featuredPosts"],
        queryFn: fetchFeaturedPosts,
    });

    if (isPending) return <Loader />;
    if (error) return "Something went wrong: " + error.message;
    if (!data || data.length === 0) return "No featured posts found.";
    
    const [main, ...others] = data;

    return (
        <div className='mt-8 flex flex-col gap-8 lg:flex-row'>
            {/* Main featured */}
            <div className='w-full lg:w-1/2 flex flex-col gap-4'>
                <Image src={main.img || 'default.jpg'} className='rounded-3xl object-cover shadow-md' w={895} />
                <div className='flex items-center gap-2'>
                    <h1 className='font-semibold lg:text-lg'>1.</h1>
                    <Link to={`/posts?cat=${main.category}`} className='text-blue-500 lg:text-lg'>{main.category}</Link>
                    <span className='text-gray-500 '>{formatDistanceToNow(main.createdAt)}</span>
                </div>
                <Link to={`/${main.slug}`} className='text-lg lg:text-3xl font-semibold lg:font-bold text-justify'>
                    {main.title}
                </Link>
            </div>

            {/* Other featured */}
            <div className='w-full lg:w-1/2 flex flex-col gap-4'>
                {others.map((post, idx) => (
                    <div key={post._id} className='lg:h-1/3 flex justify-between gap-4'>
                        <div className='w-1/3 aspect-video'>
                            <Image src={post.img || 'default.jpg'} className='rounded-3xl object-cover w-full h-full shadow-md' w={298} />
                        </div>
                        <div className='w-2/3'>
                            <div className='flex items-center gap-4 text-sm lg:text-base mb-2 mt-1'>
                                <h1 className='font-semibold'>{idx + 2}.</h1>
                                <Link to={`/posts?cat=${post.category}`} className='text-blue-500'>{post.category}</Link>
                                <span className='text-gray-500 text-sm'>{formatDistanceToNow(post.createdAt)}</span>
                            </div>
                            <Link
                                to={`/${post.slug}`}
                                className='text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-semibold'
                                title={post.title}
                            >
                                {post.title}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturedPost;
