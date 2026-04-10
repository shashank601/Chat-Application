export default function Bubble({ senderName, content, createdAt, isMine }) {
    return (
        <div>
            <p>{senderName}: {content}</p>
            <p>{createdAt.toLocaleString()}</p>
        </div>
    );
}