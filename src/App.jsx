import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Catalog from "./pages/Catalog.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import About from "./pages/About.jsx";
import Checkout from "./pages/Checkout.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:id" element={<ProductDetail />} />
        <Route path="/a-propos" element={<About />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Layout>
  );
}
