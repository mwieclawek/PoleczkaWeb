import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import MenuSection from "@/components/sections/MenuSection";
import { Reservation } from "@/components/Reservation";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      <Navbar />
      <Hero />
      <About />
      <MenuSection />
      <Reservation />
      <Contact />
      <Footer />
    </div>
  );
}
