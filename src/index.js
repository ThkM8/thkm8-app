const checkPrFormat = require('./checkPrFormat.js');

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Probot} app
 */
module.exports = (app) => {
  // Your code here
  app.log.info("Yay, the app was loaded!");

  // app.on("issues.opened", async (context) => {
  //   const issueComment = context.issue({
  //     body: "Thanks for opening this issue!",
  //   });
  //   return context.octokit.issues.createComment(issueComment);
  // });

  // app.on("push", async (context) => {
  //   // Code was pushed to the repo, what should we do with it?
  //   app.log.info(context);
  // });

  // app.on("push", async (context) => {
  //   // Code was pushed to the repo, what should we do with it?
  //   app.log.info(context);
  // });

  app.on('push', async (context) => app.log.info('push', context));

  app.on(checkPrFormat.events, checkPrFormat.logic);
  app.on(checkPrFormat.events, async (context) => app.log.info('checkPrFormat', context));

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};

console.log(process.env);