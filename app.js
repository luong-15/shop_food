const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 3000;
const secretKey = 'secret_key';

// MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'shopfood'
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// User registration
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Check if user already exists
  pool.query('SELECT * FROM shopfood.user WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert user into database
    pool.query('INSERT INTO shopfood.user (username, email, password) VALUES (?, ?, ?)', [username, email, hashedPassword], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      return res.redirect('/');
    });
  });
});

// User login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  pool.query('SELECT * FROM shopfood.user WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = results[0];

    // Compare passwords
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ iduser: user.iduser, username: user.username, role: user.role }, secretKey, { expiresIn: '1h' });

      // Set cookie with secure flag (HTTPS recommended)
      res.cookie('token', token, { httpOnly: true, secure: true });

      return res.redirect('/');
    });
  });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // unauthorized

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // forbidden
    req.user = user;
    next();
  });
}

// API lấy dữ liệu người dùng từ token
app.get('/api/user', authenticateToken, (req, res) => {
  const userId = req.user.id;

  pool.query('SELECT * FROM shopfood.user WHERE id = ?', [userId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send();
    } else {
      res.json(results[0]);
    }
  });
});

// Endpoint to handle the filter request
app.get('/filter', async (req, res) => {
  const foodType = req.query.type;

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM shopfood.products WHERE typeproduct = ?', [foodType]);
    connection.release();

    res.json(rows); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
});

// Endpoint to fetch slideshow images
app.get('/slideshow', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM shopfood.slides');
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching slideshow images');
  }
});