// Sidebar.js
import { Home, Calendar, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-blue-800 text-white">
      <div className="p-4 border-b border-blue-700">
        <h1 className="text-2xl font-bold">Employee Portal</h1>
      </div>
      <nav className="mt-6">
        <a
          href="#"
          className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200"
        >
          <Home className="w-5 h-5 mr-3" />
          <span>Dashboard</span>
        </a>
        <a
        
        onClick={() => navigate("/home")}
          className="flex items-center py-3 px-6 bg-blue-900 text-white"
        >
          <Calendar className="w-5 h-5 mr-3" />
          <span>Events</span>
        </a>
        <a
          onClick={() => navigate("/myteams")}
          className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200"
        >
          <Users className="w-5 h-5 mr-3" />
          <span>My Teams</span>
        </a>
        <a
          href="#"
          className="flex items-center py-3 px-6 text-blue-100 hover:bg-blue-700 transition-colors duration-200"
        >
          <Settings className="w-5 h-5 mr-3" />
          <span>Settings</span>
        </a>
      </nav>
    </aside>
  );
}
