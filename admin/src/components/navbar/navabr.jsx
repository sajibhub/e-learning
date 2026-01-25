import { FaBars } from "react-icons/fa";

const Navbar = ({ toggleSidebar, title = "Dashboard" }) => (
  <header className="bg-white/10 backdrop-blur-md border border-white/30 sticky top-0 z-30 shadow-lg">
    <div className="flex items-center justify-between px-6 py-4">
      {/* Sidebar toggle (mobile) */}
      <button
        className="lg:hidden text-white cursor-pointer hover:text-white/80"
        onClick={toggleSidebar}
      >
        <FaBars size={24} />
      </button>

      <h1 className="text-xl font-bold text-white">{title}</h1>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <img
          src="https://picsum.photos/seed/user123/40/40.jpg"
          alt="User"
          className="rounded-full w-10 h-10"
        />
        <button className="text-white hover:text-white/80">
        </button>
      </div>
    </div>
  </header>
);

export default Navbar;
