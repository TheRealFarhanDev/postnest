import { formatDistanceToNow } from 'date-fns';
import Image from './Image';
import { Link } from 'react-router-dom'

const PostListItem = ({ post }) => {
    return (
        <div className='flex flex-col xl:flex-row gap-8 mb-4 md:mb-8'>
            {/* image  */}
            <div className='md:hidden xl:block xl:w-1/3'>
                <Image
                    src={post.img}
                    w={735}
                    h={200}
                    className="rounded-2xl object-cover shadow-md h-[200px] w-full"
                />
            </div>
            {/* detailes  */}
            <div className='flex flex-col gap-2.5 xl:w-2/3'>
                <Link to={`/${post.slug}`} className='text-4xl font-semibold'>
                    {post.title}
                </Link>

                <div className='flex items-center gap-2 text-gray-400 text-sm'>
                    <span>Written by</span>
                    <Link to={`/posts?user=${post.user.username}`} className='text-blue-800'>
                        {post.user.username}
                    </Link>
                    <span>on</span>
                    <Link to={`/posts?cat=${post.category}`} className='text-blue-800'>
                        {post.category}
                    </Link>
                    <span>{formatDistanceToNow(new Date(post.createdAt))}</span>
                </div>

                <p className='text-justify'>{post.desc}</p>
                <Link to={`/${post.slug}`} className='underline text-blue-800 text-sm'>
                    Read More
                </Link>
            </div>
        </div>
    )
}

export default PostListItem
