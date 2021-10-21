# Getting Started R^My Health App

This application is designed to mimic a possible user application for interacting with an application that can leverage Redox's APIs that interact with Carequality.

This project is NOT production ready and is severely lacking:

- Security best practices
- Robust error handling
- Extensive usability testing
- Unit and integration testing

I hope to improve upon all of these issues, but even then this is still only intended as a tool to gain insight into what can be done, a recommended pathway/approach, and a tool to demo functionality.

# Background

## Carequality

Start [here](https://www.redoxengine.com/product/carequality/) to learn about Carequality from Redox. A more [technical guide](https://developer.redoxengine.com/carequality/technical-guide/) is available as well. Last, a [FAQ](https://developer.redoxengine.com/carequality-faq/) has answers to a lot of questions that may come up.

## Application background

Currently, only the patient search directly to a rendered C-CDA is supported as a workflow. In addition, there is an audit of HTTP calls available. Anything else needs to be added and will be worked on in due time. Please let me know if you'd like to contribute!

This application uses a publicly available Heroku proxy for testing only. This is because Redox's API endpoints do NOT include CORS headers and the browser will block requests. This Heroku proxy adds in those headers. This isn't safe for production, you should run your own server where you can shield your API secrets rather than expose those as React environment variables. Please reach out with any questions.

# Running the app

## Prerequisites

You'll need Node and npm installed to run this app. NPM has good instructions [here](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

Open up this repository and run `$ npm i` or `$ npm install`. This will install all appropriate components. Once that is done, you can use one of the below scripts depending on your need.

## Available Scripts

In the project directory, you can run:

### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run prettify` or `npm run prettifier:check`

The former will automatically format your files according to the default [prettier](https://prettier.io/) setup. The latter will just check and inform you of issues.

### `npm run lint` or `npm run lint:clean`

The opposite of above because linting has slightly increased risk, the default will check linting and inform of issues to be fixed. The latter will try to fix that is possible to fix and leave the rest for manual resolution.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
