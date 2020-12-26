# MinWiz - Minimal starter kit for under 1 KB sites

Use this template to create a **viable, good looking, production-ready website** whose home page does not exceed 1 KB compressed size when opened in a browser. Ideally, the total size of all assets (HTML, CSS, favicon, etc.) downloaded by the browser when opening the page will be under 1KB. You can see a live version at [MinWiz.com](https://minwiz.com)

## Getting started

Make sure you have Node and npm installed. Any version will do.

If you're doing web development you probably already have gulp-cli globally installed (you can test with `gulp -v`). If you don't have it, run `npm install --global gulp-cli`

- clone the repo
- install the dependencies with `npm install`
- build the site (in the _dist_ folder) with `npm run build`
- at this point, the _dist_ folder contains all assets in a minified form, ready to be copied/deployed to your web hosting service
