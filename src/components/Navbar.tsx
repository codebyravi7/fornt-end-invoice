import { Link, LogOut, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import logo from "../../public/logo.png";
import { logout } from "../redux/store"; // Import resetProducts

const NavbarAndHeader = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const user = useSelector((state: any) => state.auth.user);
  const dispatch = useDispatch();

  return (
    <div className="font-sans">
      <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <img
                src={logo}
                alt="logo-image"
                className="h-12 w-auto rounded-full shadow-md"
              />
            </div>
            {user && <div className="flex items-center">
              <button
                type="button"
                onClick={() => dispatch(logout())}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>}
          </div>
        </div>
      </nav>

      {user && <header className="bg-gray-100 shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex justify-between p-4">
              {/* Show Home button only when not on the home page */}
              {location.pathname !== "/" && (
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="mr-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  Home
                </button>
              )}

              {/* Show All Invoices button only when not on the invoices page */}
              {location.pathname !== "/invoices" && (
                <button
                  type="button"
                  onClick={() => navigate("/invoices")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-800 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                >
                  <Link className="mr-2 h-4 w-4" />
                  All Invoices
                </button>
              )}
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-5 w-5 text-indigo-600" />
                  <p className="text-sm font-medium">
                    Welcome,{" "}
                    <span className="font-bold text-indigo-600">
                      {user.name}
                    </span>
                    !
                  </p>
                </div>
              ) : (
                <p className="text-sm font-medium text-gray-500">
                  You are not logged in.
                </p>
              )}
            </div>
          </div>
        </div>
      </header>}
    </div>
  );
};

export default NavbarAndHeader;
