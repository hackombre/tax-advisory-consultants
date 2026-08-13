import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Atouts from "@/components/Atouts";
import Team from "@/components/Team";
import Services from "@/components/Services";
import References from "@/components/References";
import SectorsZones from "@/components/SectorsZones";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";

export default function Home() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white text-navy">
        <Header />
        <Hero />
        <About />
        <Atouts />
        <Team />
        <Services />
        <References />
        <SectorsZones />
        <Contact />
        <Footer />
      </div>
    </LanguageProvider>
  );
}
