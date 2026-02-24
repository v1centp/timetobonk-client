import { useState, useEffect } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import About from "./pages/About.jsx";
import Checkout from "./pages/Checkout.jsx";
import Rides from "./pages/Rides.jsx";
import Events from "./pages/Events.jsx";
import Kom from "./pages/Kom.jsx";
import Countdown from "./pages/Countdown.jsx";
import Resume from "./pages/Resume.jsx";
import TourIrlande from "./pages/TourIrlande.jsx";
import TourIrlandeAdmin from "./pages/TourIrlandeAdmin.jsx";

// Mode lancement : mettre à true pour activer le countdown pour tous
const LAUNCH_MODE = false;
const ACCESS_KEY = "panda2026";

function useAccess() {
  const [searchParams] = useSearchParams();
  const [hasAccess, setHasAccess] = useState(() => {
    if (!LAUNCH_MODE) return true;
    return localStorage.getItem("panda_access") === "granted";
  });

  useEffect(() => {
    if (!LAUNCH_MODE) return;

    // Reset access with ?reset
    if (searchParams.has("reset")) {
      localStorage.removeItem("panda_access");
      setHasAccess(false);
      return;
    }

    // Grant access with ?access=panda2026
    const accessParam = searchParams.get("access");
    if (accessParam === ACCESS_KEY) {
      localStorage.setItem("panda_access", "granted");
      setHasAccess(true);
    }
  }, [searchParams]);

  return hasAccess;
}

export default function App() {
  const hasAccess = useAccess();

  // Si mode lancement actif et pas d'accès, afficher countdown
  if (LAUNCH_MODE && !hasAccess) {
    return (
      <div className="min-h-screen bg-panda-950">
        <Countdown />
      </div>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/sorties" element={<Rides />} />
        <Route path="/kom" element={<Kom />} />
        <Route path="/evenements" element={<Events />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:id" element={<ProductDetail />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/countdown" element={<Countdown />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/tour-irlande" element={<TourIrlande />} />
        <Route path="/tour-irlande/admin" element={<TourIrlandeAdmin />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}
