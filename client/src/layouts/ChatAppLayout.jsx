
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";

export default function ChatAppLayout() {
  return (
    <div className="">
      <div className="">
        <Sidebar />
      </div>
      <div className="">
        <Outlet />
      </div>
    </div>
  );
}

