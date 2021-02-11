// const http = require('http');
const init = require('./src');
const { port } = require('./src/config');



(async () => {
  const app = await init();

  app.listen(port, function () {
    console.log(`Scoring-api is listening on port ${port}`);
  })

})()
