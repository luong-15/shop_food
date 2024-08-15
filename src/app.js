const express = require('express');
const mysql = require('mysql2');
const fs = require('fs');
const app = express();

const conn = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'shopfood'
});

conn.getConnection((err) => {
  if (err) {
    console.error('Lỗi kết nối đến database:', err);
  } else {
    console.log('Kết nối đến database thành công!');

  }
});

const userDataPath = './user_data.json';

// Hàm tạo file JSON
function createJsonFile(data) {
  fs.writeFile(userDataPath, JSON.stringify(data), (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    } else {
      console.log('JSON file created successfully!');
    }
  });
}

// Lấy dữ liệu từ database và tạo file JSON
connection.query('SELECT * FROM shopfood.user', (err, results) => {
  if (err) throw err;
  createJsonFile(results);
});

// Read user data from JSON file
let userData;
try {
  userData = JSON.parse(fs.readFileSync(userDataPath, 'utf8'));
} catch (error) {
  console.error('Error reading user data:', error);
  process.exit(1);
}

// Middleware to parse JSON body data (only needed if not using a frontend framework)
app.use(express.json());

// Login route using data from user_data.json
app.post('/public/index.html', (req, res) => {
  const { username, password } = req.body;

  // Find the matching user in the JSON data
  const matchedUser = userData.find(user => user.username === username);

  if (!matchedUser) {
    return res.status(401).json({ error: 'Invalid credentials: Username not found' });
  }

  if (matchedUser.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials: Incorrect password' });
  }

  return res.json({ message: 'Login successful' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


app.get('/public/profile.html', function(req, res) {
  const sql = "SELECT * FROM shopfood.user";
  conn.query(sql, function(err, results) {
    if (err) throw err;
    res.send(results);
  });
});