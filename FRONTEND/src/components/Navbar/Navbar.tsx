import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import DropdownMenu from "./DropdownMenu";
import UserIcon from "../../assets/default_user.jpg"
import { getCurrentUser, logOut } from "../../auth/auth";

const Navbar: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const nav = useNavigate();

  const logoutUser = async () => {
    try {
      await logOut();
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
      nav("/login");
    } catch (e: any) {
      console.error("Error logging out: ", e);
    }
  };

  useEffect(() => {
    const unsubscribe = getCurrentUser((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <nav className="flex items-center py-2 px-5 bg-white relative z-20 shadow-lg">
        <div className="flex justify-between w-full items-center">
          {/* Mobile Hamburger or Logo */}
          <div className="flex items-center">
            {/* If the screen is small, show the hamburger menu */}
            <div className="md:hidden">
              <button onClick={toggleMobileMenu} className="text-3xl">
                {isMobileMenuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
              </button>
            </div>
            {/* Show the logo on medium screens and larger */}
            <div className="hidden md:block pl-6 font-bold">
              <Link to="/home">Weather App</Link>
            </div>
          </div>

          {/* Desktop Links - Currently none */}

          {!loading && (
            <>
              {user ? (
                <div
                  ref={dropdownRef}
                  className="relative ml-auto cursor-pointer"
                  tabIndex={0}
                  onBlur={(e) => {
                    if (!dropdownRef.current?.contains(e.relatedTarget)) {
                      setIsDropdownOpen(false);
                    }
                  }}
                >
                  <div
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={user.photoURL || UserIcon}
                      alt="Profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-bold">{user.email}</span>
                  </div>
                  {isDropdownOpen && <DropdownMenu logoutUser={logoutUser} />}
                </div>
              ) : (
                <div className="flex space-x-4 ml-auto">
                  <Link to="/login">
                    <button className="text-black border-none py-2 px-5 rounded-md font-bold transition-colors hover:bg-gray-200 cursor-pointer">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="text-white bg-primary-500 py-2 px-5 rounded-md font-bold transition-colors hover:bg-gray-400 cursor-pointer">
                      Become a Member
                    </button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg z-50 md:hidden">
            <div className="flex flex-col items-start p-4">
              <Link
                to="/home"
                className="mb-2 font-bold text-orange-500 no-underline"
              >
                Home
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
