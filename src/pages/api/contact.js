import { connect } from '../../app/utils/mongodb';
import Contact from '../../model/Contact';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Connect to the database
            console.log("before connect");
            await connect();
            console.log("after connect");

            const { name, email, phone, subject, message } = req.body;

            // Validate required fields
            if (!name || !email || !message) {
                return res.status(400).json({ message: 'Name, email, and message are required.' });
            }

            // Create a new contact document
            console.log("before create contact");
            const newContact = new Contact({ name, email, phone, subject, message });
            console.log("after create contact", newContact);

            // Save the document to the database
            await newContact.save();

            return res.status(201).json({ message: 'Message sent successfully' });
        } catch (error) {
            console.error('Error in /api/contact:', error);
            return res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    } else {
        // Only POST method is allowed
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
