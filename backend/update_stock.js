const mongoose = require('mongoose');

async function updateStock() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/cellphones-clone');
        console.log('Connected to MongoDB');

        // Update all products in the 'products' collection
        const result = await mongoose.connection.collection('products').updateMany(
            {},
            { $set: { totalStock: 100 } }
        );

        console.log(`Updated ${result.modifiedCount} products with stock 100`);

        // Also ensure slugs are present if missing
        const products = await mongoose.connection.collection('products').find({ slug: { $exists: false } }).toArray();
        for (const p of products) {
            if (p.url) {
                const slug = p.url.split('/').pop().replace('.html', '');
                await mongoose.connection.collection('products').updateOne({ _id: p._id }, { $set: { slug } });
            } else {
                const slug = p.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                await mongoose.connection.collection('products').updateOne({ _id: p._id }, { $set: { slug } });
            }
        }

        console.log('Slugs updated if missing');

    } catch (error) {
        console.error('Error updating products:', error);
    } finally {
        await mongoose.disconnect();
    }
}

updateStock();
