import { connect } from '../../../app/utils/mongodb';
import Admin from '../../../model/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        try {
            // Connect to the database using the provided connect function
            await connect();
            console.log(username, password)

            // Find the admin user by username
            const admin = await Admin.findOne({ username });
            console.log(admin)

            // Validate the admin exists and that the password matches
            if (admin) {
                // Generate a JWT token with a 1-hour expiration
                const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
                return res.status(200).json({ token });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } catch (error) {
            console.error('Error in /api/auth/login:', error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    } else {
        // Only allow POST requests
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
