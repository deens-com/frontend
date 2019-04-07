import React from 'react';
import styled from 'styled-components';
import Input from 'shared_components/StyledInput';
import { Dropdown } from 'semantic-ui-react';
import { media } from 'libs/styled';

const Form = styled.form`
  label {
    font-weight: bold;
    margin-bottom: 5px;
  }
`;

const Title = styled.div`
  font-weight: bold;
  text-transform: uppercase;
  font-size: 12px;
  color: #c4c4c4;
  border-bottom: 1px solid #c4c4c4;
  text-align: center;
  margin: 30px 0;
  line-height: 0.1em;

  > span {
    background: white;
    padding: 0 10px;
  }
`;

const Guest = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #c4c4c4;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  margin-top: 10px;
  ${media.minSmall} {
    margin-right: 0;
    margin-top: 0;
    margin-left: 10px;
  }
`;

const TitleSelection = styled(Group)`
  width: 100px;
  margin-left: 0;
`;

const Type = styled.div`
  color: #00e4ff;
  font-weight: bold;
`;

/**
 * Builds up the higher level blocks of the page
 */
const GuestsData = ({ guests, onChange }) => {
  return (
    <Form>
      <Title>
        <span>Guests Details</span>
      </Title>
      {guests.map((guest, i) => (
        <React.Fragment key={i}>
          <Type>
            {i + 1}- {guest.type.charAt(0).toUpperCase() + guest.type.slice(1)}
          </Type>
          <Guest>
            <TitleSelection>
              <label htmlFor="title">Title</label>
              <Input>
                <Dropdown
                  name="title"
                  options={[
                    { text: 'Mr.', value: 'Mr' },
                    { text: 'Mrs.', value: 'Mrs' },
                    { text: 'Miss.', value: 'Miss' },
                  ]}
                  guest={i}
                  onChange={onChange}
                  selection
                  fluid
                />
              </Input>
            </TitleSelection>
            <Group>
              <label htmlFor="firstName">First Name</label>
              <Input
                name="firstName"
                onChange={event =>
                  onChange(event, { guest: i, value: event.target.value, name: 'firstName' })
                }
              />
            </Group>
            <Group>
              <label htmlFor="lastName">Last Name</label>
              <Input
                name="lastName"
                onChange={event =>
                  onChange(event, { guest: i, value: event.target.value, name: 'lastName' })
                }
              />
            </Group>
          </Guest>
        </React.Fragment>
      ))}
    </Form>
  );
};

GuestsData.propTypes = {};

export default GuestsData;
