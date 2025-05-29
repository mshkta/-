export default function Input({ value, onChange, placeholder, id }) {
  return <input id={id} value={value} onChange={onChange} placeholder={placeholder} style={{ padding: "8px", margin: "4px", border: "1px solid #ccc", borderRadius: "4px" }} />;
}
