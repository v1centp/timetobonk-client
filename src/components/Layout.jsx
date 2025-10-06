import { Link, NavLink } from "react-router-dom";

export default function Layout({ children }) {
   return (
      <div className="app">
         <header className="header">
            <div className="container nav">
               <Link to="/" className="brand" aria-label="La réserve de la Panda Cycling">
                  <span className="dot" />
                  <span>La réserve de la <strong>Panda Cycling</strong></span>
               </Link>
               <nav className="menu">
                  <NavLink to="/" end>Home</NavLink>
                  <NavLink to="/catalog">Catalogue</NavLink>
                  <NavLink to="/a-propos">À propos</NavLink>
               </nav>
            </div>
         </header>

         <main className="container">{children}</main>

         <footer className="footer">
            <div className="container footer-row">
               <span>© {new Date().getFullYear()} Panda Cycling — Tous droits réservés.</span>
               <span className="muted">Minimal. Clean. Vélo.</span>
            </div>
         </footer>
      </div>
   );
}
