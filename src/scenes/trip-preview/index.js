import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { PageWrapper } from 'shared_components/layout/Page';
import NotFound from 'styled_scenes/NotFound';
import { minutesToDays } from 'libs/Utils';
import { P, H1, H3, PStrong } from 'libs/commonStyles';
import { Loader } from 'semantic-ui-react';
import { Trans } from '@lingui/macro';
import BrandFooter from 'shared_components/BrandFooter';
import Itinerary from './Itinerary';
import { backgroundDark } from 'libs/colors';
import { getHeroImageUrlFromMedia } from 'libs/media';
import Toggle from 'shared_components/ToggleSwitch';
import people from 'assets/people.svg';
import Logo from 'shared_components/icons/Logo';
import calendar from 'assets/calendar.svg';

const Wrapper = styled.div`
  position: relative;
`;

const Content = styled(PageWrapper)`
  max-width: 100vw;
  width: 100vw;
  display: flex;
  flex-direction: column;
`;

const TopContent = styled(PageWrapper)`
  max-width: 1150px;
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 15px;
`;

const Title = styled(H1)`
  margin-bottom: 20px;
`;

const TitleAndDesc = styled.div`
  background: white;
  max-width: 520px;
  width: 100%;
  padding: 15px;
  margin: 20px;
  border-radius: 5px;
`;

const ImageBackground = styled.div`
  background: url(${props => props.img});
  background-size: cover;
  width: 100%;
  min-height: 650px;
  background-color: ${backgroundDark};
  margin-top: 15px;
`;

const TripData = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 35px 0;
`;

const DataElement = styled.div`
  text-align: center;
  img {
    height: 70px;
    width: 70px;
  }
`;

class TripPreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTransports: false,
    };
  }

  toggleTransports = () => {
    this.setState(prev => ({
      showTransports: !prev.showTransports,
    }));
  };

  render() {
    if (this.props.error) {
      return <NotFound />;
    }

    if (this.props.isLoading || !this.props.trip) {
      return <Loader inline="centered" />;
    }

    const numberOfPeople =
      (this.props.trip.adultCount || 0) +
      (this.props.trip.infantCount || 0) +
      (this.props.trip.childrenCount || 0);
    const numberOfDays = minutesToDays(this.props.trip.duration || 0);
    return (
      <Wrapper>
        {this.props.trip && !this.props.isCloning ? (
          <Content>
            <TopContent>
              <Toggle onSwitch={this.toggleTransports}>
                <P>
                  <Trans>Transports</Trans>
                </P>
              </Toggle>
              <ImageBackground img={getHeroImageUrlFromMedia(this.props.trip.media)}>
                <TitleAndDesc>
                  <Title>{this.props.trip.title}</Title>
                  <P>{this.props.trip.description}</P>
                </TitleAndDesc>
              </ImageBackground>
              <TripData>
                <DataElement>
                  <img src={people} alt="People" />
                  <H3>
                    <Trans>{numberOfPeople} people</Trans>
                  </H3>
                </DataElement>
                <DataElement>
                  <span style={{ width: 70, height: 70, position: 'relative' }}>
                    <H1
                      style={{ position: 'absolute', margin: 'auto', bottom: 0, left: 0, right: 0 }}
                    >
                      {numberOfDays}
                    </H1>
                    <img src={calendar} alt="Calendar" />
                  </span>
                  <H3>
                    <Trans>{numberOfDays} days</Trans>
                  </H3>
                </DataElement>
                <div style={{ textAlign: 'center' }}>
                  <PStrong>
                    <Trans>Trip created on</Trans>
                  </PStrong>
                  <Logo style={{ height: 70 }} />
                </div>
              </TripData>
            </TopContent>
            <Itinerary
              trip={this.props.trip}
              inDayServices={this.props.inDayServices}
              services={this.props.services}
              showTransports={this.state.showTransports}
              transports={this.props.transports}
            />
          </Content>
        ) : (
          <Loader inline="centered" active />
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
    tags: state.entities.tags,
    transports: state.tripDesigner.transports,
    availabilities: state.tripDesigner.availabilities.data,
    isCheckingAvailability: state.tripDesigner.availabilities.isLoading,
    isLoadingTransportation: state.tripDesigner.isLoadingTransportation,
    lastRemovedService: state.tripDesigner.lastRemovedService,
    suggestedTags: state.tripDesigner.suggestedTags,
    isCloning: state.trips.isCloning,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripPreview));
