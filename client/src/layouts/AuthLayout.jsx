import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="">
      <div className="bg-slate-200 h-screen w-screen flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}

