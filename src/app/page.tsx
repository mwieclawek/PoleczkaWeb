import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import MenuSection from "@/components/sections/MenuSection";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F9F3DB]">
      <Navbar />
      <Hero />
      <About />
      <MenuSection />
      <Contact />
      <Footer />
    </div>
  );
}
