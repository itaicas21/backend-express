//
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const fs = require("fs");
const path = require("path");
const dir = process.env.NODE_ENV === "test" ? "./tests" : "./bins";
const { validId } = require("./utils.js");
//
app.use("/b", (req, res, next) => {
  setTimeout(next, 1000);
});
app.use("/b", (req, res, next) => {
  setTimeout(next, 1000);
});
app.use(express.json());
//
app.get("/b", (req, res) => {
  const allFileNames = fs.readdirSync(`${dir}`);
  const idFiles = [];
  allFileNames.forEach((file) => {
    if (
      path.extname(file) === ".json" &&
      file !== "package-lock.json" &&
      file !== "package.json"
    ) {
      idFiles.push(JSON.parse(fs.readFileSync(`${dir}/${file}`)));
    }
  });
  return res.send(idFiles);
});

app.get(`/b/:id`, (req, res) => {
  const { id } = req.params;
  if (validId(id) === false) {
    return res.status(422).send({ message: "Invalid Id" });
  }
  if (fs.existsSync(`${dir}/${id}.json`)) {
    const binContent = fs.readFileSync(`${dir}/${id}.json`);
    return res.json(JSON.parse(binContent));
  }
  return res.status(404).send({ message: "File not found" });
});

// no body/ invalid body not implemented yet
app.post(`/b`, (req, res) => {
  let uniqueId = uuidv4();
  req.body.id = uniqueId;
  if (!(req.headers["content-type"] === "application/json")) {
    return res
      .status(400)
      .send("Bad request- content type not set to app/json");
  }
  //if uuid library is implemented crooked
  while (fs.existsSync(`${dir}/${uniqueId}.json`)) {
    uniqueId = uuidv4();
    req.body.id = uniqueId;
  }
  fs.writeFileSync(
    `${dir}/${uniqueId}.json`,
    JSON.stringify(req.body),
    () => {}
  );
  return res.json(JSON.parse(fs.readFileSync(`${dir}/${uniqueId}.json`)));
});

app.put(`/b/:id`, (req, res) => {
  const { id } = req.params;
  if (validId(id) === false) {
    return res.status(422).send({ message: "Invalid Id" });
  }
  if (!(req.headers["content-type"] === "application/json")) {
    return res
      .status(400)
      .send("Bad request- content type not set to app/json");
  }

  if (fs.existsSync(`${dir}/${id}.json`)) {
    const data = fs.readFileSync(`${dir}/${id}.json`);
    const json = JSON.parse(data);
    for (let prop in req.body) {
      json[prop] = req.body[prop];
    }
    fs.writeFileSync(`${dir}/${id}.json`, JSON.stringify(json));
    return res.send(fs.readFileSync(`${dir}/${id}.json`));
  }
  return res.status(404).send("File does not exist");
});
app.delete(`/b/:id`, (req, res) => {
  const { id } = req.params;
  if (validId(id) === false) {
    return res.status(422).send({ message: "Invalid Id" });
  }
  if (fs.existsSync(`${dir}/${id}.json`)) {
    fs.unlinkSync(`${dir}/${id}.json`);
    return res.send("deleted");
  }
  return res.status(404).send("File does not exist");
});

module.exports = app;
