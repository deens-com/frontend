import React from 'react';
import styled from 'styled-components';
import { Input, Dropdown, Form, Label } from 'semantic-ui-react';

const Guest = styled.div`
  display: flex;
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
`;

const TitleSelection = Group.extend`
  min-width: 75px;
  > div {
    width: 100%;
  }
`;

/**
 * Builds up the higher level blocks of the page
 */
const GuestsData = ({ number, onChange }) => {
  return (
    <Form>
      {Array.from({ length: number }).map((_, i) => (
        <Guest key={i}>
          <TitleSelection>
            <Label htmlFor="title">Title</Label>
            <Dropdown
              name="title"
              options={[
                { text: 'Mr.', value: 'Mr' },
                { text: 'Mrs.', value: 'Mrs' },
                { text: 'Miss.', value: 'Miss' },
              ]}
              guest={i}
              onChange={onChange}
            />
          </TitleSelection>
          <Group>
            <Label htmlFor="firstName">First Name</Label>
            <Input guest={i} name="firstName" onChange={onChange} />
          </Group>
          <Group>
            <Label htmlFor="lastName">Last Name</Label>
            <Input guest={i} name="lastName" onChange={onChange} />
          </Group>
        </Guest>
      ))}
    </Form>
  );
};

GuestsData.propTypes = {};

export default GuestsData;
