import React, { Component } from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Loader } from 'semantic-ui-react';
import actions from 'store/search/actions';
import axios from 'libs/axios';
import BrandFooter from 'shared_components/BrandFooter';
import history from 'main/history';
import headerActions from 'store/header/actions';

const PageContent = styled.div`
  margin: 0 20px auto;
`;

class TripCreatorContainer extends Component {
  componentDidMount() {
    axios.post(`/trips`, {
      basePrice: 0,
      duration: 1,
      media: [],
      services: [],
      title: {'en-us': 'Unnamed Trip'}
    }).then(response => {
      history.replace(`/trips/organize/${response.data._id}`);
    });
    this.props.changeHeader();
  }
  render() {
    return (
      <React.Fragment>
        <PageContent>
          <Loader inline="centered" active size="massive" />
        </PageContent>
        <BrandFooter withTopBorder withPadding />
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.session.session,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeDates: actions.updateSearchQuery,
      changeHeader: headerActions.changeHeader,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripCreatorContainer));
