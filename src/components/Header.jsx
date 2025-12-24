import "./header.css";
import { FiSearch, FiBell, FiChevronDown } from "react-icons/fi";

function Header({ name = "Sir" }) {
  return (
    <header className="header">
      {/* LEFT */}
      <h1 className="greeting">
        Hello, <span>{name}!</span>
      </h1>

      {/* RIGHT */}
      <div className="header-right">
        {/* SEARCH */}
        <div className="search-box">
          <FiSearch />
          <input type="text" placeholder="Search music..." />
        </div>

        {/* NOTIFICATION */}
        <button className="icon-btn">
          <FiBell />
          <span className="dot"></span>
        </button>

        {/* PROFILE */}
        <div className="profile">
          <img
            src="https://i.pravatar.cc/40?img=12"
            alt="profile"
          />
          <FiChevronDown />
        </div>
      </div>
    </header>
  );
}

export default Header;
