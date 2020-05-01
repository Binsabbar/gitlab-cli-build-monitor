# Gitlab Build Monitor
![Node.js CI](https://github.com/Binsabbar/gitlab-ci-monitor/workflows/Node.js%20CI/badge.svg)

A simple cli-based build monitor tool for Gitlab. It only monitor status for non success builds, which are:

* pending
* running
* failed

ADD [SCREENSHOT]

## Quick Start
Install the packge globally (or locally if you prefer)

* using npm: `npm install -g XXXX`
* using yarn: `yarn global add XXXX`

create configuration file as following:

```yml
baseUrl: https://gitlab.com
accessToken: some-token-goes-here
projects: #either ID number or full path to project
  - groupA/projectA
  - userA/projectB
  - groupA/projectB
  - groupA/projectV
updateIntervals: 50 # in seconds 
```

Run the monitor:
```
XXXXXX -f build-config.yml
```

# Configuration
The tool accepts a single argument to a configuration file for Gitlab.

```yml
baseUrl: https://gitlab.com
accessToken: some-token-goes-here
projects: #either ID number or full path to project
  - groupA/projectA
  - userA/projectB
  - groupA/projectB
  - 193
updateIntervals: 50 # in seconds 
```
`baseUrl`: the base url for your Gitlab (keep it as above if it not self hosted).

`accessToken`: this token is used by cli to access Gitlab API to fetch projects status. You only need readonly token.

`projects`: A list of projects to track by the build monitor. This can be a combination of id and path. Where path is: `NAMESPACE/PROJECT_PATH`.

`updateIntervals`: The intervals in seconds for when to check for build status next.

# Features to add:

[ ] Dockerise the tool.
[ ] Specify from which date to fetch pipelines, for example only show in last 3 days. [Currently using Gitlab default] 
[ ] Execlude projects pipelines based on refs. [Currently the tool tracks all refs] 
[ ] Track projects pipelines based on refs.
[ ] Explicitly specify job status to include. [Currently the tool tracks pending, running and failed only]
[ ] Make Web-based UI version.

# Limitations:
If you are going to track lots of projects that have lots of unsuccessful status, then the output will not look nice, unless you have a big screen. A way around this is to have multiple tabs open with different configuration files for each groups of projects.

## Why do I need it?
TL;DR Gitlab does not have dashboard and CCTray endpoint.

When there is a need to track multiple projects build status, it is annoying and time consuming to check projects via UI individually. Gitlab does not provide a Dashboard that shows all pipeline status. This is really important when working as DevOps over multiple projects.

## Why CLI ?
It is the simplest and fastest thing I could make in such a limited time, while getting value out of it. Check [Features to add](features-to-add) section.

## Why only pending, running or failed status? 
This is inspired by the build monitor [nevergreen](https://github.com/build-canaries/nevergreen). You most likely need to take action if something is not right with your build. Also your build should always be green.

# Contribution
Please help me improve this tool further by contributing to it. Also send me any feedback at mo.opensource.projects@gmail.com, with prefix title `[gitlab-cli-monitor] YOUR_EMAIL_TITLE`