import React from 'react';
import HelpContainer from './container';

const Home = ({ location }) => {
  return (
    <div className="Help">
      <HelpContainer routeState={location.state} />
    </div>
  );
};

export default Home;
