[![Netlify Status](https://api.netlify.com/api/v1/badges/d943ad50-997e-4a11-bf05-8b76ad36415f/deploy-status)](https://app.netlify.com/sites/minwiz/deploys)

# MinWiz - Minimal starter kit for under 2 KB sites

Use this starter kit to create a **viable, good looking, production-ready website** whose entire size does not exceed 2 KB compressed when opened in a browser. Ideally, the total size of all assets (HTML, CSS, favicon, etc.) downloaded by the browser when opening the page will be under 2 KB. You can see a live version at [MinWiz.com](https://minwiz.com).

You can quickly deploy your personal copy on Netlify (this will fork the repo in your GitHub and create a new website in your Netlify account):  
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/zeplia/minwiz)

## Getting started

Make sure you have Node and npm installed. Any version will do.

If you're doing web development you probably already have gulp-cli globally installed (you can test with `gulp -v`). If you don't have it, run `npm install --global gulp-cli`

- clone the repo
- install the dependencies with `npm install`
- build the site (in the _dist_ folder) with `npm run build`
- at this point, the _dist_ folder contains all assets in a minified form, ready to be copied/deployed to your web hosting service

If you want to live edit the site, there is a handy-dandy `gulp dev` command and the Live Server extension for VS Code is configured to open the site from _dist_ folder. Run the command, click _Go Live_ in the status panel of VS Code and you're good to go.

## Contributing

If you have a creative idea for decreasing the size of the website **feel free to submit a PR!** You can learn how from this [Step-by-step guide to contributing on GitHub](https://www.dataschool.io/how-to-contribute-on-github/).

If it's not obvious how your PR will help, please conceptually explain it. Ex:

> As the stylesheet.css already includes the text "section {", rearranging the order in "section, p, h1," to "p, h1, section {" will pick-up more text during gzipping.

Please note that I'm using package-lock with lockfileVersion 2. If you submit a PR and you're using lockfileVersion 1, make sure not to include the _package-lock.json_ file.

## Thank you

- Color scheme inspired from [john-doe.neocities.org](https://john-doe.neocities.org/).
- <del>Navigation inspired from [Functional CSS Tabs Revisited](https://css-tricks.com/functional-css-tabs-revisited/).</dev>
- [Netlify](https://www.netlify.com/) for their excellent hosting service.
- Navigation suggested by /u/trust_me_im_a_turtle on reddit. Demo [here](https://codesandbox.io/s/hash-navigation-919fp?file=/index.html:226-397).
