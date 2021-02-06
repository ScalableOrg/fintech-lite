const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/', (req, res) => {
  console.log(req.body);
});

app.listen('4000', () => {
  console.log('Webhook server started');
});
