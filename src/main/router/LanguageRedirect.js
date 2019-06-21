import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUserLanguage } from 'libs/Utils';

const LanguageRedirect = ({ ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const urlLang = props.match.params.lang;
      const userLanguage = getUserLanguage();
      if (!urlLang) {
        if (userLanguage !== 'en') {
          return (
            <Redirect
              to={{
                pathname: `${props.location.pathname}/${userLanguage}`,
                search: props.location.search,
              }}
            />
          );
        }
        return null;
      }
      if (urlLang.length !== 2) {
        if (userLanguage !== 'en') {
          return (
            <Redirect
              to={{
                pathname: `/${userLanguage}${props.location.pathname}`,
                search: props.location.search,
              }}
            />
          );
        }
        return null;
      }
      if (urlLang !== userLanguage || urlLang === 'en') {
        const newPath =
          userLanguage === 'en'
            ? props.location.pathname.replace(`/${urlLang}`, '')
            : props.location.pathname.replace(`${urlLang}/`, `${userLanguage}/`);
        console.log(props.location.pathname.replace(`/${urlLang}`, `${userLanguage}`));
        return (
          <Redirect
            to={{
              pathname: newPath,
              search: props.location.search,
            }}
          />
        );
      }
      return null;
    }}
  />
);

const mapStateToProps = state => ({
  session: state.session.session,
});

export default connect(
  mapStateToProps,
  null,
)(LanguageRedirect);
