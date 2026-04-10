import { Outlet } from "react-router-dom";
import Sidebar from "../containers/SidebarContainer";

export default function ChatAppLayout() {
  return (
    <div className="flex h-screen  overflow-hidden">
      <div className="w-1/3 h-full overflow-y-auto border-r bg-slate-50 border-zinc-900 ">
        <Sidebar />
      </div>
      <div className="w-2/3 h-full bg-[#808000] overflow-y-auto flex flex-col">
        <div className="">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

