const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function resetPassword() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/cellphones-clone');
        console.log('Connected to MongoDB');

        const hashedPassword = await bcrypt.hash('password123', 10);
        const result = await mongoose.connection.collection('users').updateOne(
            { phoneNumber: '0987654321' },
            { $set: { password: hashedPassword } }
        );

        if (result.matchedCount > 0) {
            console.log('Password updated for 0987654321');
        } else {
            console.log('User 0987654321 not found');
        }

    } catch (error) {
        console.error('Error resetting password:', error);
    } finally {
        await mongoose.disconnect();
    }
}

resetPassword();
