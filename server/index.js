import express from 'express';
import cors from 'cors';
import jsonwebtoken from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the React app
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

const JWT_SECRET = process.env.VITE_JWT_SECRET || 'nexusvenue_super_secret_key';
const PORT = process.env.PORT || 3001;

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY
);

// Register Route
app.post('/api/auth/register', async (req, res) => {
    const name = req.body.name?.trim();
    const email = req.body.email?.trim();
    const password = req.body.password;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name }
            }
        });

        if (error) {
            let errorMessage = error.message;
            if (errorMessage.toLowerCase().includes('invalid format') || errorMessage.toLowerCase().includes('is invalid')) {
                errorMessage = "Invalid email format. Note: The provider may block generic test emails like 'abc@gmail.com'. Please use a realistic email address.";
            } else if (errorMessage.toLowerCase().includes('fetch failed')) {
                errorMessage = "Authentication provider connection failed. This can happen if you are rate-limited or there is a temporary network issue. Please wait a moment and try again.";
            }
            return res.status(400).json({ success: false, message: errorMessage });
        }

        const user = data.user;
        const token = jsonwebtoken.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, token, user: { id: user.id, name, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
    const email = req.body.email?.trim();
    const password = req.body.password;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            let errorMessage = error.message;
            if (errorMessage.toLowerCase().includes('fetch failed')) {
                errorMessage = "Authentication provider connection failed. This can happen if you are rate-limited or there is a temporary network issue. Please wait a moment and try again.";
            } else {
                errorMessage = 'Invalid credentials or user not found.';
            }
            return res.status(400).json({ success: false, message: errorMessage });
        }

        const user = data.user;
        const token = jsonwebtoken.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            success: true,
            token,
            user: { id: user.id, name: user.user_metadata?.name || 'Admin', email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Middleware to verify JWT
export const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Access Denied. No token provided.' });

    try {
        const verified = jsonwebtoken.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ success: false, message: 'Invalid Token.' });
    }
};

// Catch-all route to serve the React index.html for any non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => console.log(`Backend Server running on port ${PORT}`));
