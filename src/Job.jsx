import React from 'react';
import PropTypes from 'prop-types';

const Job = ({ job }) => (
  <>
    <a key={job.id} href={job.url} target="_blank" rel="noopener noreferrer">{job.symbol}</a>
    <span>{`${job.result}\t\t--- ${job.platform}`}</span>
  </>
);

Job.propTypes = ({
  job: PropTypes.shape({
    id: PropTypes.number,
    platform: PropTypes.string,
    result: PropTypes.string,
    symbol: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
});

export default Job;
