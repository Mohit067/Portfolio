import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Statement from "@/components/Statement";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import AIEngineering from "@/components/AIEngineering";
import Skills from "@/components/Skills";
import Lab from "@/components/Lab";
import Contact from "@/components/Contact";
import AIChat from "@/components/AIChat";
import RevealObserver from "@/components/RevealObserver";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero />
        <Statement />
        <Experience />
        <Projects />
        <AIEngineering />
        <Skills />
        <Lab />
        <Contact />
      </main>
      <AIChat />
      <RevealObserver />
    </>
  );
}
