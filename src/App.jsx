import { hot } from 'react-hot-loader';
import React from 'react';

class App extends React.PureComponent {
  rootUrl = 'https://firefox-ci-tc.services.mozilla.com';

  state = {
    taskNameToManifests: {},
    project: 'mozilla-central',
    revision: '192e0e33eb597e8d923eb89f6d49bf42654e9d11',
    testPath: 'devtools/client/inspector/changes/test/browser.ini',
  };

  async componentDidMount() {
    const { project, revision } = this.state;
    const url = `${this.rootUrl}/api/index/v1/task/gecko.v2.${project}.revision.${revision}.firefox.decision/artifacts/public/manifests-by-task.json`;
    const response = await fetch(url);
    if (response.status === 200) {
      this.setState({ taskNameToManifests: await response.json() });
    }
  }

  render() {
    const {
      project, revision, taskNameToManifests, testPath,
    } = this.state;
    const tasks = [];
    const pathsToTasks = {};

    Object.entries(taskNameToManifests).forEach(([taskName, manifestPaths]) => {
      if (manifestPaths.find((path) => path === testPath)) {
        tasks.push(taskName);
      }
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
        <div>
          <span>TODO:</span>
          <ul>
            <li>Fetch actual executed tasks for a push</li>
            <li>Add links to actual jobs (or logs)</li>
            <li>Allow choosing the project and the revision</li>
            <li>Support partial match of test path</li>
          </ul>
        </div>
        <div>
          <span>{`Tasks matching ${testPath} for ${project}/${revision}`}</span>
          <ol>
            {tasks.sort().map((taskName) => <li key={taskName}>{taskName}</li>)}
          </ol>
        </div>
        <div>
          <span>Available test manifest paths:</span>
          <ol>
            {Object.keys(pathsToTasks).map((path) => <li key={path}>{path}</li>)}
          </ol>
        </div>
      </div>
    );
  }
}

export default hot(module)(App);
