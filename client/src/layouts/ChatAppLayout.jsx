import { Outlet } from "react-router-dom";
import Sidebar from "../containers/SidebarContainer";

export default function ChatAppLayout() {
  return (
    <div className="flex h-screen bg-red-100 overflow-hidden">
      <div className="w-1/3 h-full overflow-y-auto border-r bg-slate-50 border-zinc-900 ">
        <Sidebar />
      </div>
      <div className="flex-1 h-full overflow-y-auto flex flex-col">
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

