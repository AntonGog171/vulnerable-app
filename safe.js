const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const config = require('config');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const dbConfig = config.get('database');
const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to the database!');
});

app.get('/', (req, res) => {
  res.send(`
  <p><b>Safe login form</b></p>
    <form action="/login" method="post">
      <label>Username:</label><input type="text" name="username"/><br/>
      <label>Password:</label><input type="password" name="password"/><br/>
      <button type="submit">Login</button>
    </form>
    <br>
    backdoor creditentials:<br>
    login=' or password not in (select id from info where '1'='1<br>
    password=v') or '1'='1
    <br>
    <br>
    backdoor creditentials:<br>
    login=' OR '1'='1' -- <br>
    password=anything
  `);
});
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log(username)
  console.log(password)
  const query = `SELECT * FROM info WHERE login = ? AND password = ?`;
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.send(`Login failed  with <b>'${username}'</b> and <b>'${password}'</b><br>${query}`);
      return;
    }
    if (results.length > 0) {
      res.send(`Logged in successfully!!!!!!! Used <b>'${username}'</b> and <b>'${password}'</b><br><br><br>${query}`);
    } else {
      res.send(`Login failed  with <b>'${username}'</b> and <b>'${password}'</b><br>${query}`);
    }
  
  });
});

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
