# Fireblog 🔥

Fireblog is a simple markdown-based blogging platform built with [React](https://reactjs.org) that uses [Firebase](https://firebase.google.com) for data storage and user authentication. It can be easily added to any website.

[Fireblog demo](https://fireblog-2018.firebaseapp.com/)

## Getting started:

1. Clone this repository.
2. Install with `yarn install`
3. Sign up for [Firebase](https://firebase.google.com) and create a project.
4. Copy web config data from firebase:

   ![Web config](/documentation/firebase-app.jpg)

   ![Copy config](/documentation/config1.jpg)

5. Paste config in fireblogConfig.js (in the root directory of the repository):

   ![Paste config](/documentation/config2.jpg)

6. Install and run the [firebase CLI](https://firebase.google.com/docs/cli/):

   - `npm i -g firebase-tools` or `yarn global add firebase-tools`
   - Login to firebase: `firebase login`
   - Run `firebase init` and select Database (and hosting, if you will be hosting your site on firebase) ![init options](/documentation/init-options.jpg)
   - Use `build` instead of `public` directory. This can also be set later, by changing it in the firebase.json file:
     ![build](/documentation/init-options2.jpg)

7. Create the database in your project:
   ![database](/documentation/firebase1.jpg)
8. Set up sign-in methods (ex: email + password, google, twitter, etc).
   ![authentication](/documentation/firebase2.jpg)

9. Update the rules in your database to only allow writes from authorized users:
   ![Database rules](/documentation/db-rules.jpg)
10. Develop locally: `yarn start`

---

## Deploying to Production:

1. `npm run build` or `yarn build`
2. `firebase deploy`

Enjoy ❤️️
