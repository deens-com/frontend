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
/**
 * Builds up the higher level blocks of the page
 */
const GuestsData = ({ number, onChange }) => {
  return (
    <Form>
      {Array.from({ length: number }).map((_, i) => (
        <Guest key={i}>
          <Group>
            <Label for="title">Title</Label>
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
          </Group>
          <Group>
            <Label for="firstName">First Name</Label>
            <Input guest={i} name="firstName" onChange={onChange} />
          </Group>
          <Group>
            <Label for="lastName">Last Name</Label>
            <Input guest={i} name="lastName" onChange={onChange} />
          </Group>
        </Guest>
      ))}
    </Form>
  );
};

GuestsData.propTypes = {};

export default GuestsData;
