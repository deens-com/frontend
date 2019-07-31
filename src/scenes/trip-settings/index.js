import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import history from 'main/history';
import tripDesignerActions from 'store/trip-designer/actions';
import styled from 'styled-components';
import { PageWrapper } from 'shared_components/layout/Page';
import tripActions from 'store/trips/actions';
import headerActions from 'store/header/actions';
import NotFound from 'styled_scenes/NotFound';
import { H2 } from 'libs/commonStyles';
import { Loader } from 'semantic-ui-react';
import Menu from './Menu';
import GeneralSettings from './GeneralSettings';
import DaySettings from './DaySettings';
import { Trans } from '@lingui/macro';
import { minutesToDays } from 'libs/Utils';
import BrandFooter from 'shared_components/BrandFooter';
import { media } from 'libs/styled';
import { Modal } from 'semantic-ui-react';
import { I18n } from '@lingui/react';
import { t } from '@lingui/macro';

const Wrapper = styled.div`
  position: relative;
`;

const Content = styled(PageWrapper)`
  display: grid;
  grid-template-columns: 30px 1fr;
  ${media.minMediumPlus} {
    grid-column-gap: 50px;
    grid-template-columns: 150px 1fr;
  }
`;

const Title = styled(H2)`
  grid-row: 1;
  grid-column: 2 / 3;
  text-align: center;
`;

const MainContent = styled.div`
  grid-column: 1 / 3;
  margin-top: 20px;
  ${media.minMediumPlus} {
    grid-column: 2 / 3;
  }
`;

class TripSettings extends Component {
  componentDidMount() {
    this.props.changeHeader({});
  }

  state = {
    section: 'trip-settings',
    deletingTrip: false,
  };

  setCurrentSection = newSection => {
    if (newSection === 'add-day') {
      const newDuration = this.props.trip.duration + 60 * 24;
      this.props.editTrip({
        duration: newDuration,
      });
      this.setState({
        section: `day-${minutesToDays(newDuration)}`,
      });
      return;
    }

    this.setState({
      section: newSection,
    });
  };

  getDay() {
    return Number(this.state.section.split('-')[1]);
  }

  deleteDay = day => {
    this.setCurrentSection('trip-settings');
    this.props.removeDay(day);
  };

  deleteTrip = () => {
    this.props.deleteTrip();
    history.replace('/');
  };

  promptDeletePopup = () => {
    this.setState({
      deletingTrip: true,
    });
  };

  selectTags = tags => {
    if (tags.length <= 8) {
      this.props.addTagsToEntities(tags);
      this.props.editTrip({
        tags: tags.map(tag => tag._id),
      });
    }
  };

  renderSection() {
    const { section } = this.state;
    if (section === 'trip-settings') {
      return (
        <GeneralSettings
          tags={this.props.tags}
          selectTags={this.selectTags}
          suggestedTags={this.props.suggestedTags}
          cloneTrip={this.props.cloneTrip}
          deleteTrip={this.promptDeletePopup}
          trip={this.props.trip}
          editTrip={this.props.editTrip}
        />
      );
    }

    return (
      <DaySettings
        deleteDay={this.deleteDay}
        editTrip={this.props.editTrip}
        trip={this.props.trip}
        day={this.getDay()}
      />
    );
  }

  render() {
    if (this.props.error) {
      return <NotFound />;
    }

    if (this.props.isLoading || !this.props.trip) {
      return <Loader inline="centered" />;
    }

    const numberOfDays = minutesToDays(this.props.trip.duration);

    return (
      <Wrapper>
        {this.props.trip && !this.props.isCloning ? (
          <Content>
            <Title>
              {this.state.section === 'trip-settings' ? (
                <Trans>Trip Settings</Trans>
              ) : (
                <Trans>Day {this.getDay()}</Trans>
              )}
            </Title>
            <Menu numberOfDays={numberOfDays} onChangeSection={this.setCurrentSection} />
            <MainContent>{this.renderSection()}</MainContent>
            <I18n>
              {({ i18n }) => (
                <Modal
                  open={this.state.deletingTrip}
                  header={i18n._(t`Delete trip`)}
                  content={i18n._(t`Are you sure you want to delete this trip?`)}
                  onClose={() => this.setState({ deletingTrip: false })}
                  actions={[
                    i18n._(t`Keep trip`),
                    {
                      key: 'delete',
                      content: i18n._(t`Delete`),
                      negative: true,
                      onClick: this.deleteTrip,
                    },
                  ]}
                />
              )}
            </I18n>
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

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeHeader: headerActions.changeHeader,
      checkAvailability: tripDesignerActions.checkAvailability,
      getTransportation: tripDesignerActions.getTransportation,
      fetchTrip: tripDesignerActions.fetchTrip,
      editTrip: tripDesignerActions.editTrip,
      removeDay: tripDesignerActions.removeDay,
      deleteTrip: tripDesignerActions.deleteTrip,
      cloneTrip: tripActions.cloneTrip,
      addTagsToEntities: tripDesignerActions.addTagsToEntities,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withRouter(TripSettings));
