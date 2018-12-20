import React from 'react';
import { Link } from 'react-router-dom';
import { media } from 'libs/styled';
import { Loader, Dimmer } from 'semantic-ui-react';
import axios from 'libs/axios';
import history from 'main/history';
import styled from 'styled-components';
import { Page } from 'shared_components/layout/Page';
import TopBar from 'shared_components/TopBar';
import Input from 'shared_components/StyledInput';
import I18nText from 'shared_components/I18nText';
import Button from 'shared_components/Button';
import { generateTripSlug } from 'libs/Utils';

const PageContent = styled.div`
  max-width: 825px;
  margin: 0 20px auto;
  ${media.minSmall} {
    margin: 0 auto auto;
    width: 100%;
  }
`;

const BackButton = styled(Link)`
  position: relative;
  left: -250px;
  top: 20px;
  font-size: 14px;
  color: #38d39f;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  display: block;
`;

const FormInput = styled.div`
  margin-top: 20px;
`;

const Title = styled.h3`
  font-weight: bold;
`;

const Form = styled.div``;

const Content = styled.div``;

const TextArea = styled.textarea`
  border: 0;
  padding: 5px;
  outline: 0;
  font-size: 14px;
  min-height: 90px;
  width: 100%;
`;

const Publish = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 100px;
`;

const Required = () => <span style={{ color: 'red' }}>*</span>;

export default class Share extends React.Component {
  constructor(props) {
    super(props);
    this.nameInput = React.createRef();
    this.descInput = React.createRef();

    this.state = {
      isSaving: false,
      errors: {
        description: null,
        title: null,
      },
    };
  }

  handlePublish = () => {
    const description = this.descInput.current.value;
    const title = this.nameInput.current.value;

    if (!description || !title) {
      this.setState({
        errors: {
          title: !title,
          description: !description,
        },
      });
      return;
    }

    this.setState({ isSaving: true }, async () => {
      const trip = {
        title: {
          'en-us': title,
        },
        description: {
          'en-us': description,
        },
        privacy: 'public',
      };

      await axios.patch(`/trips/${this.props.trip._id}`, trip);

      history.push(`/trips/${generateTripSlug(this.props.trip)}`);
    });
  };

  render() {
    const { trip } = this.props;
    return (
      <Page>
        <TopBar fixed />
        <PageContent>
          <Dimmer active={this.state.isSaving} page>
            <Loader size="massive" />
          </Dimmer>
          <BackButton to={`/trips/organize/${this.props.tripId}`} replace>
            Back to customization
          </BackButton>
          <Content>
            <Title>Add additional information to your trip</Title>
            {trip ? (
              <Form>
                <FormInput>
                  <Label>
                    Review Trip Name <Required />
                  </Label>
                  <Input
                    error={this.state.errors.title}
                    innerRef={this.nameInput}
                    defaultValue={I18nText.translate(trip.title)}
                  />
                </FormInput>
                <FormInput>
                  <Label>
                    Add a Description <Required />
                  </Label>
                  <Input error={this.state.errors.description}>
                    <TextArea
                      ref={this.descInput}
                      defaultValue={trip.description && I18nText.translate(trip.description)}
                    />
                  </Input>
                </FormInput>
                <Publish>
                  <Button onClick={this.handlePublish} theme="fillLightGreen">
                    Publish Trip
                  </Button>
                </Publish>
              </Form>
            ) : (
              <Loader active />
            )}
          </Content>
        </PageContent>
      </Page>
    );
  }
}
