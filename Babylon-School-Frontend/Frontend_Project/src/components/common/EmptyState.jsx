export default function EmptyState({
  title = "Nothing published yet",
  text = "Comming Soon",
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
