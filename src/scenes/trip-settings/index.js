import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import tripDesignerActions from 'store/trip-designer/actions';
import styled from 'styled-components';
import { PageWrapper } from 'shared_components/layout/Page';
import headerActions from 'store/header/actions';
import NotFound from 'styled_scenes/NotFound';
import { H2 } from 'libs/commonStyles';
import { Loader } from 'semantic-ui-react';
import Menu from './Menu';
import GeneralSettings from './GeneralSettings';
import DaySettings from './DaySettings';
import { Trans } from '@lingui/macro';
import BrandFooter from 'shared_components/BrandFooter';

const Wrapper = styled.div`
  position: relative;
`;

const Content = styled(PageWrapper)`
  display: grid;
  grid-template-columns: 30px 1fr;
`;

const Title = styled(H2)`
  grid-column: 2 / 3;
  text-align: center;
`;

const MainContent = styled.div`
  grid-column: 1 / 3;
  margin-top: 20px;
`;

class TripSettings extends Component {
  state = {
    section: 'trip-settings',
  };

  setCurrentSection = newSection => {
    this.setState({
      section: newSection,
    });
  };

  getDay() {
    return Number(this.state.section.split('-')[1]);
  }

  renderSection() {
    const { section } = this.state;
    if (section === 'trip-settings') {
      return <GeneralSettings trip={this.props.trip} editTrip={this.props.editTrip} />;
    }
    return <DaySettings trip={this.props.trip} day={this.getDay()} />;
  }

  render() {
    if (this.props.error) {
      return <NotFound />;
    }

    if (this.props.isLoading || !this.props.trip) {
      return <Loader inline="centered" />;
    }

    return (
      <Wrapper>
        {this.props.trip ? (
          <Content>
            <Title>
              {this.state.section === 'trip-settings' ? (
                <Trans>Trip Settings</Trans>
              ) : (
                <Trans>Day {this.getDay()}</Trans>
              )}
            </Title>
            <Menu onChangeSection={this.setCurrentSection} />
            <MainContent>{this.renderSection()}</MainContent>
          </Content>
        ) : (
          <Loader inline="centered" />
        )}
        <BrandFooter />
      </Wrapper>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    session: state.session.session,
    trip: state.tripDesigner.trip.data,
    isLoading: state.tripDesigner.trip.isLoading,
    error: state.tripDesigner.trip.error,
    owner: state.trips.owner,
    endDate: state.search.searchQuery.end_date,
    adults: state.search.searchQuery.adults,
    children: state.search.searchQuery.children,
    infants: state.search.searchQuery.infants,
    isGDPRDismissed: state.settings.gdprDismissed,
    gdprHeight: state.settings.gdprHeight,
    services: state.entities.services,
    inDayServices: state.entities.inDayServices,
    selectedOptions: state.entities.selectedOptions,
    transports: state.tripDesigner.transports,
    availabilities: state.tripDesigner.availabilities.data,
    isCheckingAvailability: state.tripDesigner.availabilities.isLoading,
    isLoadingTransportation: state.tripDesigner.isLoadingTransportation,
    lastRemovedService: state.tripDesigner.lastRemovedService,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeHeader: headerActions.changeHeader,
      checkAvailability: tripDesignerActions.checkAvailability,
      getTransportation: tripDesignerActions.getTransportation,
      fetchTrip: tripDesignerActions.fetchTrip,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripSettings));
