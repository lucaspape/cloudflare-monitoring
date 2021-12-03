const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = 80;

const app = express();

app.use(cors());
app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '5mb'
}));

app.post('/insert', (req, res) => {
  console.log(JSON.stringify(req.body));

  res.send('OK');
});

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT);
});
