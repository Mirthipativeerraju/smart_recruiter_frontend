// UserHome.jsx
import React from 'react';
import Navbar  from "./NavigationBar";
import HeroSection from "./HeroSection";
import Footer from './Footer';
const UserHome = () => {
  // You can pass isLoggedIn as a prop if needed, or manage it with state/context
  const isLoggedIn = false; // Example, replace with actual auth logic

  return (
    <div className="user-home">
      <Navbar isLoggedIn={isLoggedIn} />
      <HeroSection />
      <Footer/>
    </div>
  );
};

export default UserHome;