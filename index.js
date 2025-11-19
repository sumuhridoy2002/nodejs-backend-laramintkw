const app = require("./app");
let PORT = process.env.PORT || 5000;
app.listen(PORT, (e) => {
  if (e) {
    console.log(e);
  } else {
    console.log("app running at " + process.env.PORT);
  }
});
