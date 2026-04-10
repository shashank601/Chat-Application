export default function Bubble({ senderName, content, createdAt, isMine }) {
  return (
    <div className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`border border-gray-200 rounded-lg p-2 w-fit max-w-[70%] min-w-[50px] min-h-[70px] ${
          isMine
            ? "bg-blue-600 rounded-tr-none"
            : "bg-[#822121] rounded-tl-none"
        }`}
      >
        <div className="font-serif text-[12px] text-white">{senderName}</div>

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
