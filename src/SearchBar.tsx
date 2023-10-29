import "./Search.css";
import { useAppDispatch } from "./redux/hooks";
import { setCurrentTab } from "./redux/tabsList";

function SearchBar() {
  const dispatch = useAppDispatch();

  return (
    <div className="search">
      <input
        className="search-txt"
        type="text"
        placeholder="Enter tags seperated by space..."
        onClick={() => dispatch(setCurrentTab(0))}
      />
    </div>
  );
}

export default SearchBar;
