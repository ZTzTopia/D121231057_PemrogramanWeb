import "./Chip.css";

export default function Chip({ children, className = "", href, ...props }) {
  const Component = href ? "a" : "span";
  return (
    <Component className={`chip ${className}`} href={href} {...props}>
      {children}
    </Component>
  );
}
