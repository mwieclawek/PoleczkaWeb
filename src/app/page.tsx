import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import MenuSection from "@/components/sections/MenuSection";
import OrderOnlineSection from "@/components/sections/OrderOnlineSection";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

export const revalidate = 60;

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFDF6] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <About />
        <MenuSection />
        <OrderOnlineSection />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
