export default function Loader() {
  return (
    <div className={`relative w-20 h-12`}>
      <span className="absolute top-0 text-xs tracking-wider animate-loader-text">loading</span>
      <span className="absolute bottom-0 h-4 w-4 rounded-full animate-loader-main">
        <span className="absolute inset-0 rounded-full animate-loader-inner" />
      </span>
    </div>
  );
}
