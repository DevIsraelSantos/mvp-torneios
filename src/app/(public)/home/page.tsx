import { NextPage } from "next";

import Page from "@/components/page";
import FeaturesSection from "../../../components/home/features-section";
import Footer from "../../../components/home/footer";
import Header from "../../../components/home/header";
import HeroSection from "../../../components/home/hero-section";
import ProcessSection from "../../../components/home/process-section";
import { Suspense } from "react";

const Home: NextPage = () => {
  return (
    <Page className="items-center justify-between h-screen">
      <Header />
      <Suspense fallback={null}>
        <HeroSection id="home" />
      </Suspense>
      <ProcessSection id="howItWorks" />
      <FeaturesSection id="features" />
      <Footer id="footer" />
    </Page>
  );
};

export default Home;
