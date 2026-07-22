import Navbar from "../component/Landing/Navbar";
import Hero from "../component/Landing/Hero";
import Trending from "../component/Landing/Trending";
import Reasons from "../component/Landing/Reasons";
import FAQ from "../component/Landing/FAQ";
import Footer from "../component/Landing/Footer";

const Home = () => {
  return (
    <div className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <Trending />
      <Reasons />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Home;