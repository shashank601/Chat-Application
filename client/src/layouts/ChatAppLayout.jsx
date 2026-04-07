import { Outlet } from "react-router-dom";
import Sidebar from "../containers/SidebarContainer";

export default function ChatAppLayout() {
  return (
    <div className="flex min-h-screen bg-red-100 ">
      <div className="w-1/3 border-r border-zinc-900">
        <Sidebar />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

