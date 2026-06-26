import React from 'react';
import contentData from '../data/content.json';
import SplashScreen from '../components/SplashScreen';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Discover from '../components/Discover';
import BestSellers from '../components/BestSellers';
import Collections from '../components/Collections';
import About from '../components/About';
import Footer from '../components/Footer';

const StorePage = () => {
  return (
    <>
      <SplashScreen data={contentData.site} />
      <Navbar data={contentData.site} />
      <main>
        <div id="home">
          <Hero data={{...contentData.hero, site: contentData.site}} />
        </div>
        <div id="products">
          <Discover data={contentData.discover} />
          <BestSellers data={contentData.bestSellers} />
          <Collections data={contentData.collections} />
        </div>
        <div id="about">
          <About data={contentData.about} />
        </div>
      </main>
      <div id="contact">
        <Footer data={{ site: contentData.site, navigation: contentData.navigation }} />
      </div>
    </>
  );
};

export default StorePage;
