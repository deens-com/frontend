<div align="center">
  <a href="https://deens.com"><img src="https://deens.com/logo.svg" alt="deens.com" width="300px"/></a>

### Book curated trips in minutes.

</div>

[![CircleCI](https://circleci.com/gh/deens-com/frontend.svg?style=svg)](https://circleci.com/gh/deens-com/frontend)

This is the repository for the frontend of [deens.com](https://deens.com). This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) and then later moved over to [React app rewired](https://github.com/timarney/react-app-rewired).

## 🏗 Development

```sh
$ git clone git@github.com:deens-com/frontend.git
$ cd frontend

# install dependencies
$ yarn
```

We have some [yarn](https://yarnpkg.com/) specific code in our `package.json` so we recommend that you use [yarn](https://yarnpkg.com/) for package management with this repo.

```sh
# export the backend endpoint to use
$ export REACT_APP_PARSE_SERVER_URL=https://staging-api.deens.com

# start the web app
$ yarn start
```

## :art: Guidelines

This project have been changing it's structure along it's way. If you are using Redux please look at `/store/trip-designer` as a reference.
Redux just saves global state. If it's well used it's very useful, but it can be a pain if you use it wrong. So if you don't need it, avoid it.

The entry point of the app is `/main/app.js`.

If you want to create a new route go to `/main/router`. We use to map a route to a component in `/scenes`. You can create your whole component there or (as we did before) link to a component in `/styled_scene`.

Most reusable functions are in `/libs` but you may find some in other files. There's no special reason for that. They should be in `/libs`.
Reusable components are in `/shared_components`. Be careful when modifying them, as you may break other part of the application.

We use [Prettier](https://github.com/prettier/prettier) to format the code for this repo.
Before committing, please run `yarn prettier-all` to format your code or add Prettier to the `pre-commit` hook to automatically take care of formatting.

Unfortunately, tests are broken. The `/cypress` dir is not useful, but it's there as a reference in case we wanted to make integration tests again.

#### How to add Prettier to pre-commit hook?

```sh
$ touch .git/hooks/pre-commit
$ chmod +x .git/hooks/pre-commit
$ echo '''#!/usr/bin/env bash

yarn lint-staged''' > .git/hooks/pre-commit
```

## :scream: Troubleshooting

If you're stuck somewhere while working on something, create an issue and we'll help you out.

## 🎓 License

Licensed under the GNU public license V3.0. See [LICENSE](LICENSE) for more information.

## :clap: Big Thanks

Cross-browser Testing Platform Provided by [Sauce Labs](https://saucelabs.com) along with some great Open Source :heart:
