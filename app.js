const express = require('express');
const app = express();
const fs = require("fs");

const pageVisits = './src/pageVisits.json';
const api = {
    input: (url) => {
        let obj = {};
        return new Promise((resolve, reject) => {
            fs.readFile(pageVisits, (err, json) => {
                if (err) reject(err);
                else resolve(JSON.parse(json));
            })
        }).then((val) => {
            obj = val;
            if (obj[url]) obj[url] += 1;
            else obj[url] = 1;
            return JSON.stringify(obj)
        }).then((stringified) => {
            return new Promise((resolve, reject) => {
                fs.writeFile(pageVisits, stringified, (err) => {
                    if (err) reject(err);
                    else resolve(obj[url]);
                });
            });
        })
    }
};

app.use((req, res, next) => {
    console.log('Something is happening. ' + req.url);
    api.input(req.url).then((num) => {
        if (num === 1) res.send('Congratulation! You are the first visitor of this url "' + req.url + '"');
        else res.send('This url "' + req.url + '" was visited ' + num + ' times');
    }).catch((err) => {
        res.send(err)
    })
});

app.listen(8080);