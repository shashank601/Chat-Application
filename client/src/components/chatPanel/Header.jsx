import { useParams } from "react-router-dom";

export default function Header() {
    const { displayName } = useParams();
    return (
        <ul className="flex sticky top-0 justify-between items-center p-4 bg-zinc-900 w-full">
            <li className="font-serif text-white">{displayName}</li>
            <li className="text-white">Delete</li>
        </ul>
    );
}