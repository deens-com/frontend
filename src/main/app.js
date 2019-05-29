import React from 'react';
import { Provider } from 'react-redux';
import queryString from 'query-string';
import Cookies from 'js-cookie';
import store from './store';
import history from 'main/history';
import { Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { getCurrentUser, getFavoriteTrips } from 'store/session/actions';
import GDPRNotification from './GDPRNotification';
import Routes from './router';
import Skeleton from './skeleton';
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  body {
    color: #262626;
    font-family: 'Nunito', sans-serif;
    font-weight: 300;
    font-size: 16px;
    word-wrap: break-word;
    -webkit-font-kerning: normal;
    font-kerning: normal;
    -webkit-font-feature-settings: 'kern', 'liga', 'clig', 'calt';
    font-feature-settings: 'kern', 'liga', 'clig', 'calt', 'kern';
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Roboto', sans-serif;
    font-weight: 700;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: #6e7885;
    transition: color 0.1s ease-in;
  }

  a:hover {
    color: #a3a9b2;
  }

  p {
    line-height: 1.48;
    margin: 0;
  }

  .semantic-popup-wrapper::before {
    box-shadow: none !important;
  }

  .bg-grey1 {
    background: #f5f7fa;
  }

  .slick-slide {
    text-align: center;
  }
  .slick-slide,
  .slick-slide:focus,
  .slick-slide div,
  .slick-slide div:focus,
  .slick-slide a {
    outline: none;
  }

  .slick-list {
    padding: 10px 0;
    margin: 0 -15px;
  }

  .text-center {
    text-align: center;
  }

  .pl-btn {
    transition: 0.1s all linear;
  }
  .pl-btn:active,
  .pl-btn:focus {
    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
  }

  .ui.button {
    font-family: 'Nunito', sans-serif;
    font-weight: 400;
  }

  img.lazyload:not([src]) {
    visibility: hidden;
  }
`;

class App extends React.Component {
  checkForReferrerAndSet = () => {
    const cookieReferrerId = 'deens_referrer_id';
    const params = queryString.parse(history.location.search);

    if (params.ref) {
      Cookies.set(cookieReferrerId, params.ref);
    }
  };

  componentDidMount() {
    getCurrentUser()(store.dispatch, store.getState).then(() => {
      getFavoriteTrips()(store.dispatch, store.getState);
    });
    this.checkForReferrerAndSet();
  }

  render() {
    return (
      <HelmetProvider>
        <GlobalStyles />
        <Provider store={store}>
          <React.Fragment>
            <GDPRNotification />
            <Router history={history}>
              <Skeleton>{Routes}</Skeleton>
            </Router>
          </React.Fragment>
        </Provider>
      </HelmetProvider>
    );
  }
}

export default App;
