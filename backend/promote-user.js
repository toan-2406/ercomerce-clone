const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/cellphones-clone').then(async () => {
    await mongoose.connection.db.collection('users').updateOne(
        { phoneNumber: '0123456789' },
        { $set: { role: 'admin' } }
    );
    console.log('Updated user to admin');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
