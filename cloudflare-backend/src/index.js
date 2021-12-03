const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('database.js');

const PORT = 80;

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

    app.post('/insert', (req, res) => {
      database.insertLog(req.body, (err, result) => {
        if(err){
          console.log(err);
          res.status(500).send('failed to log');
        }else{
          res.send('OK');
        }
      });
    });

    app.listen(PORT, () => {
      console.log('Server started on port ' + PORT);
    });

  }
});
