# github-gists-api

## Description
SPA written in Vuejs that uses the Github Gists API to display the gists for a Github user (https://docs.github.com/en/rest/gists/gists#list-gists-for-a-user).
- search input for the username of the Github user
- display some info about this username (image, name, description) and also their public gists
- gists are loaded with: title, date of creation, programming language as a colored badge, a list of their forks and the users that forked them
- on click, the gist will be loaded in a syntax-highlighted code viewer
- some page optimizations for performance.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
