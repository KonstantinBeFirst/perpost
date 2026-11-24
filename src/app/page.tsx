import AppSection from "@/components/AppSection";
import Board from "@/components/Board";
import { Business, Faq, FinalCta, Footer, Vision } from "@/components/Closing";
import { Cursor } from "@/components/fx";
import FlowModal from "@/components/FlowModal";
import Header from "@/components/Header";
import TopicModal from "@/components/TopicModal";
import Hero3D from "@/components/three/Hero3D";
import Preloader from "@/components/Preloader";
import Pricing from "@/components/Pricing";
import SmoothScroll from "@/components/SmoothScroll";
import Stats from "@/components/Stats";
import Tape from "@/components/Tape";
import UseCases from "@/components/UseCases";
import { faq } from "@/lib/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "PerPost",
      legalName: "Tischer & Co GmbH",
      url: "https://perpost.app/",
      logo: "https://perpost.app/logo-perpost.png",
      email: "mail@perpost.app",
      address: { "@type": "PostalAddress", streetAddress: "Clayallee 346A", postalCode: "14169", addressLocality: "Berlin", addressCountry: "DE" },
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <Header />
      <main>
        <Hero3D />
        <Stats />
        <Tape />
        <UseCases />
        <Pricing />
        <Board />
        <AppSection />
        <Business />
        <Vision />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <FlowModal />
      <TopicModal />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
