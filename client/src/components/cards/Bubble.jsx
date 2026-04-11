export default function Bubble({ senderName, content, createdAt, isMine }) {
  return (
    <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`border border-gray-200 bg-blue-500 rounded-2xl p-2 w-fit max-w-[70%] min-w-[50px] min-h-[70px] ${
          isMine ? " rounded-tr-none" : " rounded-tl-none"
        }`}
      >
        <div className="flex justify-between items-center gap-1">
          <div className="font-serif text-[12px] text-gray-300">{senderName}</div>
          <div>
            <img src="../../../assets/chatDeleteWhite.svg" alt="delete" className="w-3 h-3 text-slate-100 hover:opacity-80 cursor-pointer" />
          </div>
        </div>

        <div className="text-white text-center">{content}</div>

        <div className="text-right text-[10px] text-gray-300">
          {(() => {
            const date = new Date(createdAt);
            const h = date.getHours();
            const m = String(date.getMinutes()).padStart(2, "0");
            return `${h}:${m}`;
          })()}
        </div>
      </div>
    </div>
  );
}
