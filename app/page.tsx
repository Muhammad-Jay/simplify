import Header from "@/components/Landing-Page/Header";
import NavLinks from "@/components/Landing-Page/NavLinks";
import {SecondHero, Hero} from "@/components/Landing-Page/Hero";
import FeaturesContainer from "@/components/Landing-Page/FeaturesContainer";
import AboutUs from "@/components/Landing-Page/AboutUs";

export default function Home() {
  return (
      <main className="w-[100dvw] relative">
          <div className="fixed screen -z-[3] inset-0">
          </div>
          <NavLinks/>
          <Header/>
          <Hero/>
          <SecondHero/>
          <FeaturesContainer/>
          <AboutUs/>
      </main>
  );
}
