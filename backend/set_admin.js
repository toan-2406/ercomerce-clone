const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function resetAdmin() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/cellphones-clone');
        console.log('Connected to MongoDB');

        const hashedPassword = await bcrypt.hash('adminpassword123', 10);
        const result = await mongoose.connection.collection('users').updateOne(
            { phoneNumber: '0123456789' },
            { $set: { password: hashedPassword, role: 'admin', isDeleted: false, status: 'active' } }
        );

        if (result.matchedCount > 0) {
            console.log('Admin account 0123456789 updated');
        } else {
            console.log('Admin account not found, creating one...');
            await mongoose.connection.collection('users').insertOne({
                phoneNumber: '0123456789',
                password: hashedPassword,
                fullName: 'Admin System',
                role: 'admin',
                isDeleted: false,
                status: 'active',
                rank: 'S-Member',
                points: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log('Admin account created');
        }

    } catch (error) {
        console.error('Error resetting admin:', error);
    } finally {
        await mongoose.disconnect();
    }
}

resetAdmin();
