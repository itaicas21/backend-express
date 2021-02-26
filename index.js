const app = require("./app");
app.server = app.listen(3000, () => {
  console.log("Listening at port 3000");
});
