/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';

class Form extends React.PureComponent {
  render() {
    const {
      handleChange, handleSubmit, project, revision, testPath,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <label>
          Repo:
          <input name="project" type="text" value={project} onChange={handleChange} />
        </label>
        <label>
          Revision:
          <input name="revision" type="text" value={revision} onChange={handleChange} />
        </label>
        <label>
          Test path:
          <input name="testPath" type="text" value={testPath} onChange={handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

Form.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  project: PropTypes.string.isRequired,
  revision: PropTypes.string.isRequired,
  testPath: PropTypes.string.isRequired,
};

export default Form;
