const mongoose = require('mongoose');

async function fixUsers() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/cellphones-clone');
        console.log('Connected to MongoDB');

        // Update all users to ensure they have default fields
        const result = await mongoose.connection.collection('users').updateMany(
            {},
            {
                $set: {
                    isDeleted: false,
                    status: 'active'
                },
                $setOnInsert: {
                    role: 'customer'
                }
            },
            { upsert: false }
        );

        // Explicitly set role if it doesn't exist (updateMany doesn't support $setOnInsert for non-upserts the way I want)
        await mongoose.connection.collection('users').updateMany(
            { role: { $exists: false } },
            { $set: { role: 'customer' } }
        );

        console.log(`Updated ${result.modifiedCount} users with default fields`);

        const users = await mongoose.connection.collection('users').find({}).toArray();
        console.log('Updated Users:', JSON.stringify(users, null, 2));

    } catch (error) {
        console.error('Error fixing users:', error);
    } finally {
        await mongoose.disconnect();
    }
}

fixUsers();
