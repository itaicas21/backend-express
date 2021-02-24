const express = require("express");
const {v4 : uuidv4} = require("uuid");
const app = express();
const fs = require('fs');
const path = require("path");
app.use('/b', (req, res, next) => {
    setTimeout(next, 1000);
});
app.use(express.json());
const tasks=[]
app.get('/b', (req, res) => {
    const allFileNames = fs.readdirSync(`../backend-express`);
    const idFiles = [];
    allFileNames.forEach(file => {
        if (path.extname(file) === ".json" && (file!== "package-lock.json" && file!=="package.json")) {
            idFiles.push(JSON.parse(fs.readFileSync(`./${file}`)));
        }
    })
    res.send(idFiles);
});

app.get(`/b/:id`, (req, res) => {
    const { id } = req.params;
    if (fs.existsSync(`./b/${id}`)) {
        const binContent = fs.readFileSync(`./b/${id}`);
    res.send(binContent);
    }
        res.status(404).send({ message: "File not found" });
})
// no body/ invalid body not implemented yet
app.post(`/b`, (req, res) => {
    if (!(req.headers['content-type'] === 'application/json')) {
        res.status(400).send("Bad request- content type not set to app/json");
    } else{
        let uniqueId = uuidv4();
        req.body.id = uniqueId;
        //if uuid library is implemented crooked
        while (fs.existsSync(`${uniqueId}.json`)) {
            uniqueId = uuidv4();
            req.body.id = uniqueId;
        }
        fs.writeFileSync(`${uniqueId}.json`, JSON.stringify(req.body), () => { });
        res.send(fs.readFileSync(`./${uniqueId}.json`));
    }
   
})

app.put(`/b/:id`, (req, res) => {
    const { id } = req.params;
    if (!(req.headers['content-type'] === 'application/json')) {
        res.status(400).send("Bad request- content type not set to app/json");
    } else

    if (fs.existsSync(`./${id}.json`)) {
        const data = fs.readFileSync(`./${id}.json`);
        const json = JSON.parse(data);
        for (let prop in req.body) {
            json[prop] = req.body[prop];
        }
        fs.writeFileSync(`./${id}.json`, JSON.stringify(json));
        res.send(fs.readFileSync(`./${id}.json`));
    } else
    res.status(404).send("File does not exist")
})
app.delete(`/b/:id`, (req, res) => {
    const { id } = req.params;
    if (fs.existsSync(`./${id}.json`)) {
        fs.unlinkSync(`./${id}.json`);
        res.send("deleted");  
    }
    res.status(404).send("File does not exist")
})
app.listen(3000);


 