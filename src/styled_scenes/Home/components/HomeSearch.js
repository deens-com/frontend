// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { Checkbox as SemanticCheckbox, Popup } from 'semantic-ui-react';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import history from './../../../main/history';
import annyang from 'annyang';
import waveGif from './../../../assets/wave.gif';
import { media } from './../../../libs/styled';

import { Message } from 'semantic-ui-react';

import * as results_actions from './../../../scenes/results/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import i18n from './../../../libs/i18n';

// COMPONENTS
import { SearchIcon, CrossIcon, MicrophoneIcon } from '../../../shared_components/icons';
import FormControl from '../../../shared_components/Form/FormControl';
import SemanticLocationControl from 'shared_components/Form/SemanticLocationControl';
import Button from '../../../shared_components/Button';

// ACTIONS & CONFIG
import { placeholderMixin, resetButton, sizes } from '../../../libs/styled';

// STYLES
const ButtonLink = styled.button`
  ${resetButton()} color: #4fb798;
  outline: none;
  transition: color 0.1s ease-out;
  width: auto;

  &:hover,
  &:focus {
    color: #7bceb6;
  }
`;

const Span = styled.span`
  color: ${props => (props.muted ? '#99a9be' : 'inherit')};
`;

const Input = styled.input`
  appearance: none;
  background: none;
  border-radius: 3px;
  border: 0;
  display: block;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  outline: none;
  padding-top: 3px;
  width: 100%;
  color: #b5b5b6;

  ${placeholderMixin(`
    color: #B5B5B6;
  `)};
`;

const Wrapper = styled.div`
  position: relative;
  width: 504px;
  margin: auto;
  padding-bottom: 63px;
`;

const TypeIcon = styled.div`
  align-items: center;
  border-radius: 50%;
  color: #c4c4c4;
  cursor: pointer;
  display: flex;
  font-size: 24px;
  height: 40px;
  justify-content: center;
  line-height: 40px;
  margin-right: 10px;
  overflow: hidden;
  width: 40px;
  margin-top: -3px;

  &:last-child {
    margin-right: 0;
  }
`;

const SearchBg = styled.div`
  position: relative;
  align-items: center;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
  display: flex;
  min-height: 54px;
  height: auto;
  padding: 0 15px;
  width: 90%;
  margin: auto;

  ${media.mobileMinSmall} {
    width: 100%;
  }
`;

const RightIcon = styled.div`
  color: #57ad7a;
  line-height: 40px;
  width: 40px;
  font-size: 24px;
  cursor: pointer;
`;

const WaveImg = styled.img`
  max-height: 54px;
  max-width: 60%;
  width: 100%;
`;

const WaveContainer = styled.div`
  max-height: 54px;
  flex: 1;
  text-align: center;
`;

// MODULE
const locationProps = {
  inputStyles: {
    height: '100%',
    border: 0,
  },
  inputProps: {
    placeholder: 'Where would you like to go?',
    icon: false,
    as: Input,
  },
};

const LeftIcon = ({ talking, onClickTalking }) => (
  <TypeIcon onClick={talking ? onClickTalking : null}>
    {talking ? <CrossIcon /> : <SearchIcon style={{ stroke: '#c4c4c4' }} />}
  </TypeIcon>
);

class HomeSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      talking: false,
      service_type: { trip: false, place: false, activity: false, food: false },
      search: '',
      address: '',
      latitude: undefined,
      longitude: undefined,
      person_nb: undefined,
      keywords: '',
      written_speech_query: 'to use your voice and tell us about your dream stay',
      show_banner: false,
    };

    this.input = React.createRef();

    this.setType = this.setType.bind(this);
    this.setSearch = this.setSearch.bind(this);
    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    this.handleLocationChange = this.handleLocationChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handlePersonChange = this.handlePersonChange.bind(this);
    this.handleServiceTypeChange = this.handleServiceTypeChange.bind(this);
    this.handleKeywordsSearchSubmit = this.handleKeywordsSearchSubmit.bind(this);
    this.setKeyWords = this.setKeyWords.bind(this);
    this.activate_annyang = this.activate_annyang.bind(this);
    this.handleStartTalking = this.handleStartTalking.bind(this);
    this.handleStopTalking = this.handleStopTalking.bind(this);
  }

  componentDidMount() {
    // this.input.current.focus();
  }

  activate_annyang() {
    if (annyang) {
      this.handleStartTalking();
      annyang.addCallback('result', speech => {
        this.handleStopTalking();
        this.setState({ written_speech_query: speech[0] });
        console.log('The user may have said : ', speech);
        this.props.voiceQuery(speech);
        this.props.fetch_results({ speech_query: speech[0] });
        if (this.props.toggleSearch) {
          this.props.toggleSearch();
        }
      });
      // annyang.addCallback('soundstart', function() {
      // });
      /* To consider : https://github.com/TalAter/annyang/blob/master/docs/FAQ.md#what-can-i-do-to-make-speech-recognition-results-return-faster */
      annyang.start({ autoRestart: true, continuous: false });
    } else {
      this.setState({ show_banner: true });
      console.log('Your browser does not support speech recognition.');
    }
  }

  handleStartTalking() {
    this.setState({ talking: true });
  }

  handleStopTalking() {
    console.log('handlea');
    annyang.abort();
    this.setState({ talking: false });
  }

  setType(type) {
    this.setState({ type });
  }

  setSearch(ev) {
    this.setState({ search: ev.target.value });
  }

  setKeyWords(ev) {
    this.setState({ keywords: ev.target.value });
  }

  handleServiceTypeChange(event, data) {
    const service_types = { ...this.state.service_type };
    const type = data.value;
    service_types[type] = !this.state.service_type[type];
    this.setState({ service_type: service_types });
  }

  handleOnlySmartContracts = () => {
    this.setState(prevState => ({
      ...prevState,
      onlySmartContracts: !prevState.onlySmartContracts,
    }));
  };

  handleLocationChange(address) {
    geocodeByAddress(address)
      .then(results => {
        this.setState({ address });
        return getLatLng(results[0]);
      })
      .then(results => {
        const { lat, lng } = results;
        this.setState({ address, latitude: lat, longitude: lng }, this.handleSearchSubmit);
      });
  }

  handleStartDateChange(dateObject) {
    const startDate = dateObject.toISOString();
    this.setState({
      search: {
        ...this.state.search,
        startDate,
      },
    });
  }

  handleEndDateChange(dateObject) {
    const endDate = dateObject.toISOString();
    this.setState({
      search: {
        ...this.state.search,
        endDate,
      },
    });
  }

  handlePersonChange(person) {
    this.setState({ person_nb: person });
  }

  handleKeywordsSearchSubmit(ev) {
    ev.preventDefault();
    this.props.fetch_results({ speech_query: this.state.keywords });
    if (this.props.toggleSearch) {
      this.props.toggleSearch();
    }
  }

  handleSearchSubmit() {
    const { startDate, endDate } = this.state.search;

    const service_type_obj = this.state.service_type;
    const service_keys = Object.keys(service_type_obj);
    let filtered_service_type = service_keys.filter(function(key) {
      return service_type_obj[key];
    });

    const query_params = {
      service_types: filtered_service_type.join('+'),
      start_date: startDate,
      end_date: endDate,
      person_nb: this.state.person_nb,
      address: this.state.address,
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      onlySmartContracts: this.state.onlySmartContracts,
    };
    let query_arr = [];
    Object.entries(query_params).forEach(([key, value]) => {
      if (value) {
        let to_concat = key + '=' + value;
        query_arr = query_arr.concat(to_concat);
      }
    });
    let query_string = query_arr.join('&');
    if (this.props.toggleSearch) {
      this.props.toggleSearch();
    }
    history.push(`/results?${query_string}`);
  }

  renderInputContent = () => {
    if (this.state.talking) {
      return (
        <WaveContainer>
          <WaveImg src={waveGif} alt="wave" />
        </WaveContainer>
      );
    }

    return (
      <form style={{ flex: 1 }} onSubmit={this.handleKeywordsSearchSubmit}>
        <SemanticLocationControl onChange={this.handleLocationChange} {...locationProps} />
      </form>
    );
  };

  handleDismiss = () => {
    this.setState({ show_banner: false });
  };

  render() {
    const startDate = this.state.search.startDate && new Date(this.state.search.startDate);
    return (
      <Wrapper>
        <SearchBg>
          <LeftIcon talking={this.state.talking} onClickTalking={this.handleStopTalking} />
          {this.renderInputContent()}
          <RightIcon onClick={this.activate_annyang}>
            <MicrophoneIcon />
          </RightIcon>
        </SearchBg>
        {this.state.show_banner && (
          <Message
            color="red"
            onDismiss={this.handleDismiss}
            style={{ position: 'fixed', bottom: '5px', left: '5px' }}
          >
            <Message.Header>Warning !</Message.Header>
            <p>
              Your browser does not support voice recognition so we have disabled it on this
              website. Please use a compatible desktop browser like Chrome (
              <a href="https://www.google.com/chrome/">https://www.google.com/chrome/</a>)
            </p>
          </Message>
        )}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    results: state.ResultsReducer.results,
    search_query: state.ResultsReducer.search_query,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(results_actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomeSearch);

// Props Validation
HomeSearch.propTypes = {};
