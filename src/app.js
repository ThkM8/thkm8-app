const checkPrFormat = require('./checkPrFormat.js');
console.log('checkPrFormat', checkPrFormat)

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

  app.on('push', async (context) => context.log(!!context.payload));

  app.on(checkPrFormat.events, checkPrFormat.logic);
  // app.on(checkPrFormat.events[0], async (context) => context.log(checkPrFormat.events[0], context.payload));
  // app.on(checkPrFormat.events[1], async (context) => context.log(checkPrFormat.events[1], context.payload));
  // app.on(checkPrFormat.events[2], async (context) => context.log(checkPrFormat.events[2], context.payload));

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
