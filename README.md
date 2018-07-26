<div align="center">
  <a href="https://demo.please.com"><img src="https://please-com.imgix.net/static/please-logo.png?w=600" alt="please.com" width="500px"/></a>

### Book curated trips in minutes.

</div>

[![CircleCI](https://circleci.com/gh/PleaseDotCom/frontend.svg?style=svg)](https://circleci.com/gh/PleaseDotCom/frontend)

This is the repository for the frontend of [demo.please.com](https://demo.please.com). This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app) and then later moved over to [React app rewired](https://github.com/timarney/react-app-rewired).

## 🏗 Development

```sh
$ git clone git@github.com:PleaseDotCom/frontend.git
$ cd frontend

# install dependencies
$ yarn
```

We have a few [yarn](https://yarnpkg.com/) specific code in our `package.json` thus we recommend you use [yarn](https://yarnpkg.com/) for package management with this repo.

```sh
# export the backend endpoint to use
$ export REACT_APP_PARSE_SERVER_URL=https://please-api.herokuapp.com/parse

# start the web app
$ yarn start
```

## :art: Style Guidelines

We use [Prettier](https://github.com/prettier/prettier) for formatting the code for this repo.

Before comitting do run `yarn prettier-all` to format the code, or add it in the `pre-commit` hook and it'll be automatically taken care of.

#### How to add Prettier to pre-commit hook?

```sh
$ touch .git/hooks/pre-commit
$ chmod +x .git/hooks/pre-commit
$ echo '''#!/usr/bin/env bash

yarn lint-staged''' > .git/hooks/pre-commit
```

## Troubleshooting

If you're stuck somewhere while working on something create an issue or jump on to the [Telegram group](https://t.me/PleaseDotCom) and we'll help you out.

## 🎓 License

Licensed under the MIT license. See [LICENSE](LICENSE) for more information.
