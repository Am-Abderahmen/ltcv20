"use client";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import WhyUs from "./components/WhyUs";
import TrustedBy from "./components/TrustedBy";
import Gallery from "./components/Gallery";
import Process from "./components/Process";
import FAQ from "./components/FAQ";
import ContactCTA from "./components/ContactCTA";
import Footer from "./components/Footer";
import FloatingButtons from "./components/FloatingButtons";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <WhyUs />
        <TrustedBy />
        <Gallery />
        <Process />
        <FAQ />
        <ContactCTA />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
