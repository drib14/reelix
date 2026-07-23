import Navbar from "../component/Landing/Navbar";
import Hero from "../component/Landing/Hero";
import Trending from "../component/Landing/Trending";
import AIFeatureSection from "../component/Landing/AIFeatureSection";
import Reasons from "../component/Landing/Reasons";
import FAQ from "../component/Landing/FAQ";
import Footer from "../component/Landing/Footer";

const Home = () => {
  return (
    <div className="bg-[#0d0d0e] text-white min-h-screen flex flex-col w-full overflow-x-hidden">
      <Navbar />
      <Hero />
      <Trending />
      <AIFeatureSection />
      <Reasons />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Home;