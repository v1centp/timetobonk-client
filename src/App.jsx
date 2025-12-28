import { Routes, Route } from "react-router-dom";
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

export default function App() {
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
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}
