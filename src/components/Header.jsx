import './Header.css'

export default function Header() {
  return (
    <header className="sticky-header">
      <div className="container header-content">
        <a className="logo" href="/">
          Zibrisky
        </a>
        <nav className="flex flex-row">
          <a className="active" href="/">
            Home
          </a>
        </nav>
      </div>
    </header>
  );
}
