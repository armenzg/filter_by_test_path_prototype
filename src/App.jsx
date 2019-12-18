/* eslint-disable lines-between-class-members */
import { hot } from 'react-hot-loader';
import React from 'react';

import Job from './Job';
import Form from './Form';

const rootUrl = 'https://firefox-ci-tc.services.mozilla.com';
const thUrl = 'https://treeherder.mozilla.org';

const fetchJobs = async (pushId, nextUrl = undefined) => {
  const jobsUrl = nextUrl || `${thUrl}/api/jobs/?push_id=${pushId}`;
  const { next, results } = await (await fetch(jobsUrl)).json();
  let jobs = [];
  if (!next) {
    jobs = results;
  } else {
    jobs = await fetchJobs(pushId, next);
  }
  return jobs;
};

const resetFetchedData = () => ({
  jobs: [],
  taskNameToManifests: {},
});

class App extends React.PureComponent {
  handleChange = this.handleChange.bind(this);
  handleSubmit = this.handleSubmit.bind(this);
  handlePaste = this.handlePaste.bind(this);

  state = {
    jobs: [],
    taskNameToManifests: {},
    project: 'autoland',
    revision: '36d7acc1140df4e23b875177990b56362ea9a69f',
    manifestPath: 'devtools/client/inspector/changes/test/browser.ini',
  };

  async componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    const { project, revision } = this.state;
    const url = `${rootUrl}/api/index/v1/task/gecko.v2.${project}.revision.${revision}.firefox.decision/artifacts/public/manifests-by-task.json`;
    const response = await fetch(url);
    if (response.status === 200) {
      this.setState({ taskNameToManifests: await response.json() });
    } else {
      this.setState({ errorMessage: `Failed to load ${url}` });
    }
    const jobs = await this.fetchJobs(project, revision);
    this.setState({ jobs });
  }

  // eslint-disable-next-line
  async fetchJobs(project, revision) {
    const pushUrl = `${thUrl}/api/project/${project}/push/?full=true&count=10&revision=${revision}`;
    const { results } = await (await fetch(pushUrl)).json();
    return fetchJobs(results[0].id);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      ...resetFetchedData(),
    });
  }

  handlePaste(event) {
    this.setState({
      [event.target.name]: event.clipboardData.getData('Text'),
      ...resetFetchedData(),
    });
    event.preventDefault();
  }

  handleSubmit(event) {
    this.fetchData();
    event.preventDefault();
  }

  render() {
    const {
      jobs, errorMessage, project, revision, taskNameToManifests, manifestPath,
    } = this.state;
    const tasks = [];
    const pathsToTasks = {};

    if (jobs.length > 0 && Object.keys(taskNameToManifests).length > 0) {
      jobs.forEach((job) => {
        const taskName = job[4];
        const paths = taskNameToManifests[taskName] || [];
        if (paths.find((path) => path === manifestPath)) {
          tasks.push({
            id: job[1],
            url: `${thUrl}/#/jobs?repo=${project}&revision=${revision}&selectedJob=${job[1]}&searchStr=${job[4]}`,
            symbol: job[5],
            platform: job[7],
            result: job[9],
          });
        }
      });
    }

    Object.entries(taskNameToManifests).forEach(([taskName, manifestPaths]) => {
      manifestPaths.forEach((path) => {
        if (!pathsToTasks[path]) {
          pathsToTasks[path] = [taskName];
        } else {
          pathsToTasks[path].push(taskName);
        }
      });
    });
    return (
      <div>
        {errorMessage && <h3>{errorMessage}</h3>}
        <h3 style={{ fontWeight: 'bold' }}>
            NOTE: There is a bug that repositories that have nightly builds will
            fail for pushes with Nightly builds. This will be fixed.
        </h3>
        <h3 style={{ fontWeight: 'bold' }}>
            NOTE: Using this in autoland can result on no tasks matching because of SETA
            affecting what runs.
        </h3>
        <Form
          handleChange={this.handleChange}
          handleSubmit={this.handleSubmit}
          handlePaste={this.handlePaste}
          project={project}
          revision={revision}
          manifestPath={manifestPath}
        />
        <br />
        {tasks.length > 0 && (
          <div>
            <span>Tasks executed on this push that match the selected manifest path:</span>
            <ul>
              {tasks.map((job) => <li key={job.id}><Job job={job} /></li>)}
            </ul>
          </div>
        )}
        {Object.keys(pathsToTasks).length > 0 && (
          <div>
            <span>Available manifest paths:</span>
            <ul>
              {Object.keys(pathsToTasks).sort().map((path) => <li key={path}>{path}</li>)}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default hot(module)(App);
