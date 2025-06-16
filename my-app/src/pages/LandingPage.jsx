import Navbar from "../components/NavbarLandingPage";
import About from "../components/About";

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-800 min-h-screen">
      <Navbar />
      <About />
    </div>
  );
}
