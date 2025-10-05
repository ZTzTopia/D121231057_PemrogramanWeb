import "./Card.css";

export default function Card({ children, className = "", href, ...props }) {
  const Component = href ? "a" : "span";
  return (
    <Component className={`card ${className}`} href={href} {...props}>
      {children}
    </Component>
  );
}
