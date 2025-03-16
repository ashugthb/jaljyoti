import { connect } from '../../app/utils/mongodb';
import Contact from '../../model/Contact';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            // Establish a connection to MongoDB
            await connect();

            // Fetch all contacts from the database, sorted by the latest first.
            const contacts = await Contact.find({}).sort({ createdAt: -1 });

            // Return the contacts in JSON format
            return res.status(200).json({ contacts });
        } catch (error) {
            console.error('Error fetching contacts:', error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    } else {
        // Only GET method is allowed
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
