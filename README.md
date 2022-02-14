# Milestone 1 Project: Ruffhouse

Refer to the assignment for most of the details of the project

## Usage

* Run  `npm install` to install all the project dependencies
* Run `npm run start` to start the server
* Visit http://localhost:8080 in your browser to see the web application

## Development

There are TODOs scattered throughout the codebase. You can search for `CS5356 TODO` to see the items that need to be completed.

This project is __almost__ functional but missing some key elements, and some of the features won't work.

## Updates

There are likely some other bugs that I don't intend to be here, so there may be updates after

## Tweaks

I made some small tweaks to the repo

1. Used `yarn` instead of `npm`, therefor auto generated `yarn.lock` 
2. Changed `header` to `nav` in `index.js` for semantics
3. Moved `partials/footer` to inside the `<body>` tag, following the [Mozilla Sectioning Root standards](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#Sectioning_root)
4. Added `node-sass` for styling with `SCSS`, thus added custom command `"scss": "node-sass — watch scss -o css"` to `package.json`
