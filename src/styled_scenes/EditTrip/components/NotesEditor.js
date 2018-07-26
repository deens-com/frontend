import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { withFormik } from 'formik';

class NotesEditor extends Component {
  static propTypes = {
    day: PropTypes.number.isRequired,
    defaultValue: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    defaultValue: '',
  };

  render() {
    const { defaultValue, values, handleChange, handleBlur } = this.props;
    return (
      <Form>
        <Form.Field>
          <label>Notes</label>
          <Form.TextArea
            name="notes"
            placeholder="Enter notes about the day"
            defaultValue={defaultValue}
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </Form.Field>
      </Form>
    );
  }
}

export default withFormik({})(NotesEditor);
