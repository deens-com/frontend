import React, { Component } from 'react';
import HomeComponent from './../components/Home';
import { searchTrips } from 'store/search/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Helmet } from 'react-helmet';
import { websiteUrl } from 'libs/config';

class HomeContainer extends Component {
  componentDidMount() {
    this.props.searchTrips(['owner']);
  }

  render() {
    return (
      <div className="HomeContainer">
        <Helmet>
          <title>Please, plan my trip!</title>
          <link rel="canonical" href={websiteUrl} />
        </Helmet>
        <HomeComponent trips={this.props.trips} />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    trips: state.search.trips,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({ searchTrips }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeContainer);
