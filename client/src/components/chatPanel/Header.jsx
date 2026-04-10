import { useParams } from "react-router-dom";

export default function Header() {
  const { displayName } = useParams();
  return (
    <ul className="flex sticky top-0 justify-between items-center p-1 bg-zinc-900 w-full">
      <li className="font-serif text-[#c0d6c2] font-bold text-xl">{displayName}</li>
      <li className="text-white cursor-pointer bg-slate-100 hover:bg-red-500 px-1 py-1 rounded-lg hover:animate-pulse">
        <img src="../../../assets/delete.svg" alt="delete" />
      </li>
    </ul>
  );
}
