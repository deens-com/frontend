// // NPM
// import React, { Component } from "react";
// import PropTypes from "prop-types";
// import styled from "styled-components";
//
// // COMPONENTS
// import {
//   SearchIcon,
//   MicrophoneIcon,
//   DateIcon
// } from "../../../shared_components/icons";
// import FormControl from "../../../shared_components/Form/FormControl";
//
// // ACTIONS & CONFIG
// import { placeholderMixin, resetButton } from "../../../libs/styled";
//
// // STYLES
// const Button = styled.button`
//   ${resetButton()} color: #4fb798;
//   outline: none;
//   transition: color 0.1s ease-out;
//   width: auto;
//
//   &:hover,
//   &:focus {
//     color: #7bceb6;
//   }
// `;
//
// const Span = styled.span`
//   color: ${props => (props.muted ? "#99a9be" : "inherit")};
// `;
//
// const Input = styled.input`
//   appearance: none;
//   background: none;
//   border-radius: 3px;
//   border: 0;
//   display: block;
//   font-family: inherit;
//   font-size: inherit;
//   font-weight: inherit;
//   outline: none;
//   padding: 10px 0;
//   width: 100%;
//
//   ${placeholderMixin(`
//     color: #99a9be;
//   `)};
// `;
//
// const Wrapper = styled.div`
//   position: relative;
//   top: 35px;
// `;
//
// const TypeIcon = styled.div`
//   align-items: center;
//   background: ${props =>
//     props.active ? "linear-gradient(50deg, #89c8a3, #4fb798)" : "transparent"};
//   border-radius: 50%;
//   color: white;
//   cursor: pointer;
//   display: flex;
//   font-size: 24px;
//   height: 40px;
//   justify-content: center;
//   line-height: 40px;
//   margin-right: 10px;
//   overflow: hidden;
//   width: 40px;
//
//   svg {
//     height: 26px;
//     width: 26px;
//   }
//
//   &:last-child {
//     margin-right: 0;
//   }
// `;
//
// const TypeWrapper = styled.div`
//   display: flex;
//   margin-bottom: 25px;
//   padding: 0 10px;
// `;
//
// const SearchBg = styled.div`
//   position: relative;
//   align-items: center;
//   background: #fff;
//   border-radius: 4px;
//   box-shadow: 0 8px 25px 0 rgba(141, 141, 141, 0.22);
//   display: flex;
//   height: 72px;
//   padding: 0 25px;
// `;
//
// const BGPin = styled.div`
//   position: absolute;
//   background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'%3e%3cpath d='M7 4.7c0-.1-.1-.2-.1-.2L2.9.6v1.9l1.8 1.8.7.7-.7.7-1.8 1.8v1.9l3.9-3.9.2-.2c.1-.2.1-.4 0-.6z' fill='white'/%3e%3cpath d='M2.9 2.5v1.8h1.8zM2.9 5.7v1.8l1.8-1.8zM6.9 5.5c0-.1.1-.2.1-.2s-.1.1-.1.2zM6.9 4.5c0 .1.1.2.1.2s-.1-.1-.1-.2zM5.4 5l-.7-.7H2.9v1.4h1.8z' fill='white'/%3e%3c/svg%3e");
//   width: 12px;
//   height: 12px;
//   top: -8px;
//   left: 0px;
//   transition: transform 0.2s;
// `;
//
// const TabIcon = styled.span`
//   display: block;
//   height: 100%;
//   width: 100%;
// `;
//
// const DateWrap = styled.div`
//   display: flex;
//   width: 100%;
//
//   & > div {
//     border: none;
//     flex: 1;
//     position: relative;
//
//     &:first-child {
//       &:after {
//         color: red;
//         content: "";
//         display: block;
//         height: 100%;
//         position: absolute;
//         right: 10px;
//         top: 0;
//         width: 1px;
//       }
//     }
//   }
// `;
//
// // MODULE
// const searchTypes = [
//   { type: "voice", label: "V" },
//   { type: "text", label: "S" },
//   { type: "date", label: "D" }
// ];
//
// export default class HomeSearch extends Component {
//   constructor() {
//     super();
//     this.state = {
//       type: "voice",
//       search: ""
//     };
//
//     this.setType = this.setType.bind(this);
//     this.setSearch = this.setSearch.bind(this);
//     this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
//   }
//
//   componentDidUpdate() {
//     if (this.state.type === "text") {
//       this.input.focus();
//     }
//   }
//
//   setType(type) {
//     this.setState({ type });
//   }
//
//   setSearch(ev) {
//     this.setState({ search: ev.target.value });
//   }
//
//   handleSearchSubmit(ev) {
//     ev.preventDefault();
//     alert("Searching for" + this.state.search);
//     this.setState({ search: "" });
//   }
//
//   render() {
//     return (
//       <Wrapper>
//         <TypeWrapper>
//           {searchTypes.map(opt => (
//             <TypeIcon
//               key={opt.type}
//               active={opt.type === this.state.type}
//               onClick={ev => {
//                 this.setType(opt.type);
//               }}
//             >
//               {opt.type === "voice" && <MicrophoneIcon />}
//               {opt.type === "text" && <SearchIcon />}
//               {opt.type === "date" && <DateIcon />}
//             </TypeIcon>
//           ))}
//         </TypeWrapper>
//         <SearchBg>
//           <BGPin
//             style={{
//               transform: `rotate(-90deg) translateY(${
//                 this.state.type === "voice"
//                   ? "24"
//                   : this.state.type === "text" ? "72" : "122"
//               }px)`
//             }}
//           />
//           {this.state.type === "voice" && (
//             <div>
//               <Button
//                 onClick={() => {
//                   alert("Initiating serach");
//                 }}
//               >
//                 Click here
//               </Button>
//               <Span muted>
//                 {" "}
//                 to user your voice and tell us about your dream stay
//               </Span>
//             </div>
//           )}
//           {this.state.type === "text" && (
//             <form style={{ width: "100%" }} onSubmit={this.handleSearchSubmit}>
//               <Input
//                 type="text"
//                 name="search"
//                 innerRef={input => {
//                   this.input = input;
//                 }}
//                 value={this.state.search}
//                 onChange={this.setSearch}
//                 placeholder="Stary typing.."
//               />
//             </form>
//           )}
//           {this.state.type === "date" && (
//             <DateWrap>
//               <FormControl
//                 type="date"
//                 onChange={value => {
//                   console.log(value);
//                 }}
//                 value=""
//                 placeholder="Start date"
//                 leftIcon="date"
//               />
//               <FormControl
//                 type="date"
//                 onChange={value => {
//                   console.log(value);
//                 }}
//                 value=""
//                 placeholder="End date"
//                 leftIcon="date"
//               />
//             </DateWrap>
//           )}
//         </SearchBg>
//       </Wrapper>
//     );
//   }
// }
//
// // Props Validation
// HomeSearch.propTypes = {};

// NPM
import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Checkbox as SemanticCheckbox } from "semantic-ui-react";
import queryString from "query-string";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

import history from "./../../../main/history";

// COMPONENTS
import {
  SearchIcon,
  MicrophoneIcon,
  DateIcon
} from "../../../shared_components/icons";
import FormControl from "../../../shared_components/Form/FormControl";
import LocationFormControl from "../../../shared_components/Form/LocationControl";
import Button from "../../../shared_components/Button";

// ACTIONS & CONFIG
import { placeholderMixin, resetButton, sizes } from "../../../libs/styled";

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
  color: ${props => (props.muted ? "#99a9be" : "inherit")};
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
  background: ${props =>
    props.active ? "linear-gradient(50deg, #89c8a3, #4fb798)" : "transparent"};
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

const TabIcon = styled.span`
  display: block;
  height: 100%;
  width: 100%;
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
        content: "";
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
`;

const ButtonWrap = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding-top: 1%;
  padding-bottom: 1%;
`;

// MODULE
const searchTypes = [
  { type: "voice", label: "V" },
  { type: "text", label: "S" },
  { type: "date", label: "D" }
];

export default class HomeSearch extends Component {
  constructor() {
    super();
    this.state = {
      type: "voice",
      service_type: { trip: false, place: false, activity: false, food: false },
      search: "",
      address: "",
      latitude: undefined,
      longitude: undefined,
      person_nb: undefined,
      keywords: ""
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
  }

  componentDidUpdate() {
    if (this.state.type === "text") {
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
    this.setState({keywords: ev.target.value});
  }

  handleServiceTypeChange(event) {
    const service_types = { ...this.state.service_type };
    const type = event.target.innerText.toLowerCase();
    service_types[type] = !this.state.service_type[type];
    this.setState({ service_type: service_types });
  }

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
        startDate
      }
    });
  }

  handleEndDateChange(dateObject) {
    const endDate = dateObject.toISOString();
    this.setState({
      search: {
        ...this.state.search,
        endDate
      }
    });
  }

  handlePersonChange(person) {
    // this.setState({
    //   search: {
    //     ...this.state.search,
    //     person
    //   }
    // });
    this.setState({ person_nb: person });
  }

  handleKeywordsSearchSubmit(ev){
    ev.preventDefault();
    const query_string = "keywords=" + this.state.keywords;
    history.push(`/results?${query_string}`);
  }

  handleSearchSubmit(ev) {
    ev.preventDefault();
    // TODO remove dummy data
    console.log("Searching for" + JSON.stringify(this.state.search));
    const { startDate, endDate, person } = this.state.search;

    const service_type_obj = this.state.service_type;
    const service_keys = Object.keys(service_type_obj);
    let filtered_service_type = service_keys.filter(function(key) {
      return service_type_obj[key];
    });

    const query_params = {
      service_types: filtered_service_type.join("+"),
      start_date: startDate,
      end_date: endDate,
      person_nb: this.state.person_nb,
      //address: this.state.address,
      latitude: this.state.latitude,
      longitude: this.state.longitude
    };
    let query_arr = [];
    Object.entries(query_params).forEach(([key, value]) => {
      if(value){
        let to_concat = key + "=" + value;
        query_arr = query_arr.concat(to_concat);
      }
    });
    let query_string = query_arr.join("&");

    history.push(`/results?${query_string}`);
  }

  render() {
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
              {opt.type === "voice" && <MicrophoneIcon />}
              {opt.type === "text" && <SearchIcon />}
              {opt.type === "date" && <DateIcon />}
            </TypeIcon>
          ))}
        </TypeWrapper>
        <SearchBg>
          <BGPin
            style={{
              transform: `rotate(-90deg) translateY(${
                this.state.type === "voice"
                  ? "24"
                  : this.state.type === "text" ? "72" : "122"
              }px)`
            }}
          />
          {this.state.type === "voice" && (
            <div>
              <ButtonLink
                onClick={() => {
                  alert("Initiating serach");
                }}
              >
                Click here
              </ButtonLink>
              <Span muted>
                {" "}
                to user your voice and tell us about your dream stay
              </Span>
            </div>
          )}
          {this.state.type === "text" && (
            <form style={{ width: "100%" }} onSubmit={this.handleKeywordsSearchSubmit}>
              <Input
                type="text"
                name="search"
                innerRef={input => {
                  this.input = input;
                }}
                value={this.state.keywords}
                onChange={this.setKeyWords}
                placeholder="Stary typing.."
              />
            </form>
          )}
          {this.state.type === "date" && (
            <div>
              <DateWrap>
                <LocationFormControl onChange={this.handleLocationChange} />

                <FormControl
                  type="date"
                  onChange={this.handleStartDateChange}
                  placeholder="Start date"
                  leftIcon="date"
                />

                <FormControl
                  type="date"
                  onChange={this.handleEndDateChange}
                  placeholder="End date"
                  leftIcon="date"
                />

                <FormControl
                  type="number"
                  onChange={this.handlePersonChange}
                  placeholder="Persons"
                  leftIcon="person"
                  min={1}
                  max={10}
                />
              </DateWrap>

              <CheckboxWrap>
                <Checkbox
                  label="Trip"
                  value="trip"
                  onClick={this.handleServiceTypeChange}
                />
                <Checkbox
                  label="Place"
                  value="place"
                  onClick={this.handleServiceTypeChange}
                />
                <Checkbox
                  label="Activity"
                  value="activity"
                  onClick={this.handleServiceTypeChange}
                />
                <Checkbox
                  label="Food"
                  value="food"
                  onClick={this.handleServiceTypeChange}
                />
              </CheckboxWrap>

              <ButtonWrap>
                <Button
                  round
                  theme="mainFilled"
                  onClick={this.handleSearchSubmit}
                  align="center"
                >
                  Search now
                </Button>
              </ButtonWrap>
            </div>
          )}
        </SearchBg>
      </Wrapper>
    );
  }
}

// Props Validation
HomeSearch.propTypes = {};
