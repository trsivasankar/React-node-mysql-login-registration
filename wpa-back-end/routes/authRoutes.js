import express from 'express'
import { connectToDatabase } from '../lib/db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Register Route
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const db = await connectToDatabase();

        // Check if user already exists
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }

        // Hash password and insert user
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)", 
            [username, email, hashedPassword]
        );

        console.log("User registered:", { username, email }); // Debug log

        return res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ message: err.message });
    }
});



// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = await connectToDatabase();

        console.log("Login attempt for email:", email);

        // Fetch user from database
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

        console.log("User found in DB:", rows);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        // Log the plain text and hashed passwords
        console.log("Plaintext password:", password);
        console.log("Hashed password from DB:", rows[0].password);

        // Compare passwords
        const isMatch = await bcrypt.compare(password, rows[0].password);
        console.log("Password match result:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ message: "Wrong password" });
        }

        // Generate token
        const token = jwt.sign({ id: rows[0].id }, process.env.JWT_KEY, { expiresIn: '3h' });

        return res.status(200).json({ token, user: {
            id: rows[0].id,
            username: rows[0].username,
            email: rows[0].email
        } });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error" });
    }
});

// Middleware to Verify Token
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(403).json({ message: "No Token Provided" });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

// Home Route (Protected)
router.get('/home', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User does not exist" });
        }

        return res.status(200).json({ user: rows[0] });
    } catch (err) {
        console.error("Home Route Error:", err);
        return res.status(500).json({ error: "Server error" });
    }
});

router.get('/intro', verifyToken, async (req, res) => {
    try {
        const db = await connectToDatabase();
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ user: rows[0] });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
