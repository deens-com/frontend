// NPM
import React, { Component } from 'react';
import styled from 'styled-components';
import { Checkbox as SemanticCheckbox, Popup } from 'semantic-ui-react';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import history from './../../../main/history';
import annyang from 'annyang';
import waveGif from './../../../assets/wave.gif';

import { Message } from 'semantic-ui-react';

import * as results_actions from './../../../scenes/results/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import i18n from './../../../libs/i18n';

// COMPONENTS
import { SearchIcon, MicrophoneIcon, DateIcon } from '../../../shared_components/icons';
import FormControl from '../../../shared_components/Form/FormControl';
import LocationFormControl from '../../../shared_components/Form/LocationControl';
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
  padding: 10px 0;
  width: 100%;

  ${placeholderMixin(`
    color: #99a9be;
  `)};
`;

const Wrapper = styled.div`
  position: relative;
  top: 35px;
`;

const TypeIcon = styled.div`
  align-items: center;
  background: ${props => (props.active ? '#4eb798' : '#d3e9db')};
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  font-size: 24px;
  height: 40px;
  justify-content: center;
  line-height: 40px;
  margin-right: 10px;
  overflow: hidden;
  width: 40px;

  svg {
    height: 26px;
    width: 26px;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const TypeWrapper = styled.div`
  display: flex;
  margin-bottom: 25px;
  padding: 0 10px;
`;

const SearchBg = styled.div`
  position: relative;
  align-items: center;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
  display: flex;
  min-height: 72px;
  height: auto;
  padding: 0 25px;
`;

const BGPin = styled.div`
  position: absolute;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3e%3cpath d='M7 4.7c0-.1-.1-.2-.1-.2L2.9.6v1.9l1.8 1.8.7.7-.7.7-1.8 1.8v1.9l3.9-3.9.2-.2c.1-.2.1-.4 0-.6z' fill='white'/%3e%3cpath d='M2.9 2.5v1.8h1.8zM2.9 5.7v1.8l1.8-1.8zM6.9 5.5c0-.1.1-.2.1-.2s-.1.1-.1.2zM6.9 4.5c0 .1.1.2.1.2s-.1-.1-.1-.2zM5.4 5l-.7-.7H2.9v1.4h1.8z' fill='white'/%3e%3c/svg%3e");
  width: 12px;
  height: 12px;
  top: -8px;
  left: 0px;
  transition: transform 0.2s;
`;

const DateWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  & > div {
    border: none;
    flex: 1;
    position: relative;

    &:first-child {
      &:after {
        color: red;
        content: '';
        display: block;
        height: 100%;
        position: absolute;
        right: 10px;
        top: 0;
        width: 1px;
      }
    }
  }

  @media all and (max-width: ${sizes.medium}) {
    flex-wrap: wrap;

    & > div {
      flex: 1 1 100%;
    }
  }

  @media all and (max-width: ${sizes.small}) {
    flex-wrap: wrap;
    padding-bottom: 5%;

    & > div {
      flex: 1 1 100%;
    }
  }
`;

const CheckboxWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding-top: 1%;
  padding-bottom: 1%;

  @media all and (max-width: ${sizes.small}) {
    padding-bottom: 7%;
  }
`;

const Checkbox = styled(SemanticCheckbox)`
  margin-left: 1%;
  margin-right: 1%;
  margin-bottom: 10px;
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding-top: 1%;
  padding-bottom: 1%;
`;

// MODULE
const searchTypes = [
  { type: 'voice', label: 'V' },
  { type: 'text', label: 'S' },
  { type: 'date', label: 'D' },
];

class HomeSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'voice',
      service_type: { trip: false, place: false, activity: false, food: false },
      search: '',
      address: '',
      latitude: undefined,
      longitude: undefined,
      person_nb: undefined,
      keywords: '',
      written_speech_query: 'to use your voice and tell us about your dream stay',
      show_wave_gif: false,
      show_banner: false,
    };

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
    this.render_voice_search_form = this.render_voice_search_form.bind(this);
    this.show_gif = this.show_gif.bind(this);
  }

  componentDidMount() {}

  activate_annyang() {
    let that = this;
    if (annyang) {
      this.show_gif();
      annyang.addCallback('result', speech => {
        annyang.abort();
        that.hide_gif();
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

  show_gif() {
    this.setState({ show_wave_gif: true });
  }

  hide_gif() {
    this.setState({ show_wave_gif: false });
  }

  componentDidUpdate() {
    if (this.state.type === 'text') {
      this.input.focus();
    }
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
        this.setState({ address, latitude: lat, longitude: lng });
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

  handleSearchSubmit(ev) {
    ev.preventDefault();
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
      address: this.state.address ? this.state.address + '936ZER0378' : '',
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

  render_voice_search_form() {
    if (this.state.show_wave_gif) {
      return (
        <div>
          <img src={waveGif} alt="wave" style={{ maxHeight: '65px' }} />
          <Span muted style={{ position: 'relative', bottom: '24px' }}>
            {' '}
            {this.state.written_speech_query ===
            'to use your voice and tell us about your dream stay'
              ? ''
              : this.state.written_speech_query}
          </Span>
        </div>
      );
    } else {
      return (
        <div>
          {this.state.written_speech_query ===
          'to use your voice and tell us about your dream stay' ? (
            <Popup
              trigger={<ButtonLink onClick={this.activate_annyang}>Click here</ButtonLink>}
              content="and say &quot;Trip to Paris&quot; or &quot;Looking for a trip in New York for next month with my husband&quot;"
              position="bottom left"
              size="huge"
              verticalOffset={20}
              flowing={true}
              inverted={true}
            />
          ) : null}

          <Span muted> {this.state.written_speech_query}</Span>
        </div>
      );
    }
  }

  handleDismiss = () => {
    this.setState({ show_banner: false });
  };

  render() {
    const startDate = this.state.search.startDate && new Date(this.state.search.startDate);
    return (
      <Wrapper>
        <TypeWrapper>
          {searchTypes.map(opt => (
            <TypeIcon
              key={opt.type}
              active={opt.type === this.state.type}
              onClick={ev => {
                this.setType(opt.type);
              }}
            >
              {opt.type === 'voice' && <MicrophoneIcon />}
              {opt.type === 'text' && <SearchIcon />}
              {opt.type === 'date' && <DateIcon />}
            </TypeIcon>
          ))}
        </TypeWrapper>
        <SearchBg>
          <BGPin
            style={{
              transform: `rotate(-90deg) translateY(${
                this.state.type === 'voice' ? '24' : this.state.type === 'text' ? '72' : '122'
              }px)`,
            }}
          />
          {this.state.type === 'voice' && this.render_voice_search_form()}
          {this.state.type === 'text' && (
            <form style={{ width: '100%' }} onSubmit={this.handleKeywordsSearchSubmit}>
              <Input
                type="text"
                name="search"
                innerRef={input => {
                  this.input = input;
                }}
                value={this.state.keywords}
                onChange={this.setKeyWords}
                placeholder="Start typing.."
              />
            </form>
          )}
          {this.state.type === 'date' && (
            <div>
              <DateWrap>
                <LocationFormControl onChange={this.handleLocationChange} />

                <FormControl
                  type="date"
                  onChange={this.handleStartDateChange}
                  placeholder="Start date"
                  leftIcon="date"
                  dayPickerProps={{ disabledDays: { before: new Date() } }}
                  inputProps={{ readOnly: true }}
                />

                <FormControl
                  type="date"
                  onChange={this.handleEndDateChange}
                  placeholder="End date"
                  leftIcon="date"
                  dayPickerProps={{ disabledDays: { before: startDate || new Date() } }}
                  inputProps={{ readOnly: true }}
                />

                <FormControl
                  type="number"
                  onChange={this.handlePersonChange}
                  placeholder="Persons"
                  leftIcon="person"
                  min={1}
                  max={10}
                  onKeyPress={e => (e.charCode >= 48 && e.charCode <= 57) || e.preventDefault()}
                />
              </DateWrap>

              <CheckboxWrap>
                <Checkbox label="Trip" value="trip" onClick={this.handleServiceTypeChange} />
                <Checkbox
                  label={i18n.t('places.singular')}
                  value="place"
                  onClick={this.handleServiceTypeChange}
                />
                <Checkbox
                  label="Activity"
                  value="activity"
                  onClick={this.handleServiceTypeChange}
                />
                <Checkbox label="Food" value="food" onClick={this.handleServiceTypeChange} />
                <Checkbox
                  label="Decentralized"
                  value="smart"
                  onClick={this.handleOnlySmartContracts}
                />
              </CheckboxWrap>

              <ButtonWrap>
                <Button round theme="mainFilled" onClick={this.handleSearchSubmit} align="center">
                  Search now
                </Button>
              </ButtonWrap>
            </div>
          )}
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
              website. Please use a compatible desktop browser like Chrome (<a href="https://www.google.com/chrome/">
                https://www.google.com/chrome/
              </a>)
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
