const mongoose = require('mongoose');

async function checkUsers() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/cellphones-clone');
        console.log('Connected to MongoDB');

        const users = await mongoose.connection.collection('users').find({}).toArray();
        console.log('Users in database:', JSON.stringify(users, null, 2));

    } catch (error) {
        console.error('Error checking users:', error);
    } finally {
        await mongoose.disconnect();
    }
}

checkUsers();
