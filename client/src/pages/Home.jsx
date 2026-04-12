
export default function Home() {
  return (
    <div className="h-full w-full bg-zinc-900">
      <div className="flex flex-col justify-center items-center h-screen w-full">
        
        <p className="text-2xl font-bold text-slate-100 px-4 py-2 rounded-lg animate-pulse">Join a Chat to get Realtime messages</p>
        <p className="text-sm text-zinc-800 px-4 py-2 rounded-lg hover:text-slate-800 hover:font-semibold"><span className="animate-ping ">NOTE: </span>sidebar last_message only updates if you explicitly open that chat, this app's developer didnt like the idea of joining all chats automatically</p>
      </div>
    </div>
  );
}

