import { useParams } from "react-router-dom";

export default function Header() {
  const { displayName } = useParams();
  return (
    <ul className="flex sticky top-0 justify-between items-center p-4 bg-zinc-900 w-full">
      <li className="font-serif text-white">{displayName}</li>
      <li className="text-white cursor-pointer bg-slate-100 hover:bg-red-500 p-2 rounded-lg hover:animate-pulse">
        <img src="../../../assets/delete.svg" alt="delete" />
      </li>
    </ul>
  );
}
