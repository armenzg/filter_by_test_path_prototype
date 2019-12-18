/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import PropTypes from 'prop-types';

class Form extends React.PureComponent {
  render() {
    const {
      handleChange, handlePaste, handleSubmit, manifestPath, project, revision,
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <label>
          Repo:
          <input name="project" type="text" value={project} onChange={handleChange} onPaste={handlePaste} />
        </label>
        <label>
          Revision:
          <input name="revision" type="text" value={revision} onChange={handleChange} onPaste={handlePaste} />
        </label>
        <label>
          Manifest path:
          <input name="manifestPath" type="text" value={manifestPath} onChange={handleChange} onPaste={handlePaste} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

Form.propTypes = {
  handleChange: PropTypes.func.isRequired,
  handlePaste: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  manifestPath: PropTypes.string.isRequired,
  project: PropTypes.string.isRequired,
  revision: PropTypes.string.isRequired,
};

export default Form;
