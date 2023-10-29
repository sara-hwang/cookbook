import "./Search.css";

function SearchBar() {
  return (
    <div className="search">
      <input
        className="search-txt"
        type="text"
        placeholder="Enter tags seperated by space..."
      />
    </div>
  );
}

export default SearchBar;
