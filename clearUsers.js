require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/internship';

const clearUsers = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');

        // Drop the users collection
        await mongoose.connection.db.dropCollection('users').catch(() => {
            console.log('Users collection does not exist or already empty');
        });

        console.log('✅ Users collection cleared successfully');

        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

clearUsers();
