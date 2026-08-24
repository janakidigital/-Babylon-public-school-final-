export default function EmptyState({
  title = "Nothing published yet",
  text = "This section is managed from the school admin panel. Content will appear here as soon as it is added.",
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
