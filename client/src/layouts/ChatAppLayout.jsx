import { Outlet } from "react-router-dom";
import Sidebar from "../containers/SidebarContainer.jsx";

export default function ChatAppLayout() {
  return (
    <div className="flex h-screen  overflow-hidden">
      <div className="w-1/3 h-full overflow-y-auto border-r bg-slate-50 border-zinc-900 ">
        <Sidebar />
      </div>
      <div className="w-2/3 h-full overflow-y-auto bg-contain bg-center bg-[url('/assets/pattern.svg')] bg-[length:200px_200px]">
        <Outlet />
      </div>
    </div>
  );
}

