export default function Button({ children, onClick }) {
  return <button onClick={onClick} style={{ padding: "8px 16px", margin: "4px", border: "1px solid #ccc", borderRadius: "4px" }}>{children}</button>;
}
