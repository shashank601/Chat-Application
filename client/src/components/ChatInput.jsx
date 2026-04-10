

export default function ChatInput() {
    return (
        <div className="sticky bottom-0 w-full bg-white border-t p-2">
            <textarea type="text" placeholder="Type your message..."></textarea>
            <button>Send</button>
        </div>
    );
}