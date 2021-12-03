const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./database.js');

const config = require('./config.json');

const PORT = 80;
const API_PREFIX = '/cloudflare/api';

database.connect((err) => {
  if(err){
    console.log(err);
  }else{
    const app = express();

    app.use(cors());
    app.use(bodyParser.json({limit: '5mb'}));
    app.use(bodyParser.urlencoded({
      extended: true,
      limit: '5mb'
    }));

    app.post(API_PREFIX + '/insert', (req, res) => {
      if(req.body.key === config.api_key){
        database.insertLog(req.body.values, (err, result) => {
          if(err){
            console.log(err);
            res.status(500).send('failed to log');
          }else{
            res.send('OK');
          }
        });
      }else{
        res.status(401).send('Unauthorized');
      }
    });

    app.listen(PORT, () => {
      console.log('Server started on port ' + PORT);
    });

  }
});
