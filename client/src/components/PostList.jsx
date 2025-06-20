import PostListItem from './PostListItem'
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import Loader from './Loader.jsx'
import InfiniteScroll from "react-infinite-scroll-component"
import { useSearchParams } from 'react-router-dom'

const fetchPosts = async ({ pageParam = 1, queryKey }) => {
  const [, searchParamsString] = queryKey;

  const searchParams = new URLSearchParams(searchParamsString);
  if (!searchParams.has("sort")) searchParams.set("sort", "newest");
  const searchParamsObj = Object.fromEntries(searchParams);

  searchParamsObj.page = pageParam;
  searchParamsObj.limit = 3;

  const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts`, {
    params: searchParamsObj
  });

  return res.data;
};

const PostList = () => {
  const [searchParams] = useSearchParams();

  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts', searchParams.toString()],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, pages) => lastPage.hasMore ? pages.length + 1 : undefined,
  });

  const posts = data?.pages.flatMap(page => page.posts) || [];

  if (isLoading) return <Loader />
  if (error) return 'An error has occurred: ' + error.message;

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<Loader />}
      endMessage={<h4 className='m-4'>All Posts Loaded</h4>}
    >
      {posts.map(post => (
        <PostListItem key={post._id} post={post} />
      ))}

      {isFetchingNextPage && <Loader className="mt-2 font-bold" />}
    </InfiniteScroll>
  )
}

export default PostList
