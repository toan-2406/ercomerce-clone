const mongoose = require('mongoose');

async function seedNews() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/cellphones-clone');
        console.log('Connected to MongoDB');

        const news = [
            {
                title: 'Đánh giá iPhone 16 Pro Max sau 3 tháng sử dụng: Vẫn là nhà vua?',
                slug: 'danh-gia-iphone-16-pro-max',
                content: '<p>iPhone 16 Pro Max mang lại trải nghiệm tuyệt vời với màn hình lớn hơn và nút Control Camera mới...</p>',
                summary: 'Trải nghiệm chi tiết siêu phẩm iPhone 16 Pro Max sau thời gian dài sử dụng thực tế.',
                thumbnail: 'https://cdn2.cellphones.com.vn/x/media/wysiwyg/Home/Review_ip16pm.jpg',
                author: 'Minh Tuấn',
                isPublished: true,
                createdAt: new Date()
            },
            {
                title: 'Top 5 laptop gaming đáng mua nhất dịp Tết 2026',
                slug: 'top-5-laptop-gaming-tet-2026',
                content: '<p>Nếu bạn đang tìm kiếm một chiếc laptop để chiến game xuyên Tết, đây là danh sách không thể bỏ qua...</p>',
                summary: 'Danh sách các mẫu laptop gaming mạnh mẽ nhất, đáng sở hữu nhất trong đầu năm 2026.',
                thumbnail: 'https://cdn2.cellphones.com.vn/x/media/wysiwyg/Home/laptop-gaming-tet.jpg',
                author: 'Hoàng Long',
                isPublished: true,
                createdAt: new Date()
            },
            {
                title: 'Mẹo sử dụng Samsung Galaxy S24 Ultra cực đỉnh',
                slug: 'meo-su-dung-s24-ultra',
                content: '<p>Tối ưu hóa thời lượng pin và tận dụng tối đa AI trên S24 Ultra với những bí kíp sau...</p>',
                summary: 'Những thủ thuật hay giúp bạn làm chủ chiếc điện thoại cao cấp nhất của Samsung.',
                thumbnail: 'https://cdn2.cellphones.com.vn/x/media/wysiwyg/Home/s24-ultra-tips.jpg',
                author: 'Thùy Chi',
                isPublished: true,
                createdAt: new Date()
            }
        ];

        await mongoose.connection.collection('posts').deleteMany({});
        await mongoose.connection.collection('posts').insertMany(news);

        console.log('Seed news successfully');

    } catch (error) {
        console.error('Error seeding news:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seedNews();
