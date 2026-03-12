/* ==========================================================
 * App Component – Root layout for the workshop website
 * 
 * Assembles all sections: Navbar, Hero, Speaker, Agenda,
 * EventDetails, Registration, and Footer.
 * ========================================================== */

import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Speaker from './components/Speaker';
import Agenda from './components/Agenda';
import EventDetails from './components/EventDetails';
import Registration from './components/Registration';
import Login from './components/Login';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="app">
      <Navbar user={user} onLogout={() => setUser(null)} />
      <Hero />
      <Speaker />
      <Agenda />
      <EventDetails />
      <Registration />
      <Login user={user} onLogin={setUser} />
      <Footer />
    </div>
  );
}

export default App;
