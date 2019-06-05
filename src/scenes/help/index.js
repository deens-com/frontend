import React from 'react';
import HelpContainer from './container';

const Home = ({ location }) => {
  return (
    <div className="Help">
      <HelpContainer data={location.state && location.state.helpData} />
    </div>
  );
};

export default Home;
