import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  sub: string;
  name: string;
}


export default function Navbar() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: TokenPayload = jwtDecode(token);
        setUsername(decoded.name);
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null);
    window.location.href = "/"; // odświeżenie/redirect po wylogowaniu
  };

  return (
    <div className="bg-red-200 shadow-md h-[100px] w-full sticky top-0 z-50">
      <nav className="flex justify-between items-center px-6 py-4 h-full max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="ClothCloud"
            className="h-9 w-auto max-w-[120px]"
          />
        </div>

        <div className="flex flex-col justify-between h-[60px]">
          {username ? (
            <>
              <span className="h-1/3 px-4 py-1 text-sm rounded-full bg-green-200 text-gray-800 flex items-center justify-center">
                Logged as: {username}
              </span>
              <div className="h-1/3" /> {/* Przestrzeń */}
              <button
                onClick={handleLogout}
                className="px-4 py-1 text-sm rounded-full bg-gray-300 hover:bg-gray-400 text-gray-800 flex items-center justify-center border border-gray"
                style={{ height: '33.33%' }}
              >
                Logout
              </button>
            </>
          ) : (
            <div className="space-x-4">
              <Link
                to="/signin"
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}