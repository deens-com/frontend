import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'semantic-ui-react';
import { withFormik } from 'formik';

class NotesEditor extends Component {
  static propTypes = {
    // day index
    day: PropTypes.number.isRequired,
    // the already existing value of note
    defaultValue: PropTypes.string,
    // if note already exists then the noteId
    noteId: PropTypes.string,
    // action to upsert note
    saveDayNote: PropTypes.func.isRequired,
  };

  static defaultProps = {
    defaultValue: '',
  };

  render() {
    const { defaultValue, values, handleChange, handleSubmit, submitForm } = this.props;
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <label>Notes</label>
          <Form.TextArea
            name="note"
            placeholder="Enter notes about the day"
            defaultValue={defaultValue}
            value={values.note}
            onChange={handleChange}
            onBlur={submitForm}
          />
        </Form.Field>
      </Form>
    );
  }
}

export default withFormik({
  handleSubmit: (values, { props }) =>
    props.saveDayNote({ ...values, day: props.day, noteId: props.noteId }),
})(NotesEditor);
