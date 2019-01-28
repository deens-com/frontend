<div align="center">
  <a href="https://demo.please.com"><img src="https://please-com.imgix.net/static/please-logo.png?w=600" alt="please.com" width="500px"/></a>

### Book curated trips in minutes.

</div>

[![CircleCI](https://circleci.com/gh/PleaseDotCom/frontend.svg?style=svg)](https://circleci.com/gh/PleaseDotCom/frontend)

This is the repository for the frontend of [please.com](https://please.com). This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) and then later moved over to [React app rewired](https://github.com/timarney/react-app-rewired).

## 🏗 Development

```sh
$ git clone git@github.com:PleaseDotCom/frontend.git
$ cd frontend

# install dependencies
$ yarn
```

We have some [yarn](https://yarnpkg.com/) specific code in our `package.json` so we recommend that you use [yarn](https://yarnpkg.com/) for package management with this repo.

```sh
# export the backend endpoint to use
$ export REACT_APP_PARSE_SERVER_URL=https://staging-api.please.com

# start the web app
$ yarn start
```

## :art: Style Guidelines

We use [Prettier](https://github.com/prettier/prettier) to format the code for this repo.

Before committing, please run `yarn prettier-all` to format your code or add Prettier to the `pre-commit` hook to automatically take care of formatting.

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

### :clap: Big Thanks

Cross-browser Testing Platform Provided by [Sauce Labs](https://saucelabs.com) along with some great Open Source :heart:
