import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Search from './Search.jsx';

const SideMenu = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("sort", e.target.value);
    navigate(`/posts?${newParams.toString()}`, { replace: false });
  };

  const categories = ["web-design", "development", "databases", "seo", "marketing"];

  return (
    <div className='h-max sticky top-4'>
      <h1 className='mb-4 text-sm font-medium'>Search</h1>
      <Search />

      <h1 className='mt-8 mb-4 text-sm font-medium'>Filter</h1>
      <div className='flex flex-col gap-2 text-sm'>
        {["newest", "popular", "trending", "oldest"].map((sort) => (
          <label key={sort} className='flex items-center gap-2 cursor-pointer'>
            <input
              type="radio"
              name="sort"
              value={sort}
              checked={searchParams.get("sort") === sort}
              onChange={handleSortChange}
              className='accent-blue-800 w-4 h-4 cursor-pointer'
            />
            {sort.charAt(0).toUpperCase() + sort.slice(1)}
          </label>
        ))}
      </div>

      <h1 className='mt-8 mb-4 text-sm font-medium'>Categories</h1>
      <div className='flex flex-col gap-2 text-sm'>
        {/* All Link (removes both cat and sort) */}
        <Link
          to="/posts"
          className={`underline ${!searchParams.get("cat") ? 'text-blue-800 font-medium' : ''}`}
        >
          All
        </Link>

        {/* Category Links (remove sort param) */}
        {categories.map((cat) => {
          const newParams = new URLSearchParams(searchParams.toString());
          newParams.set("cat", cat);
          newParams.delete("sort");

          return (
            <Link
              key={cat}
              to={`/posts?${newParams.toString()}`}
              className={`underline ${searchParams.get("cat") === cat ? 'text-blue-800 font-medium' : ''}`}
            >
              {cat.replace("-", " ").replace(/^\w/, c => c.toUpperCase())}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SideMenu;
