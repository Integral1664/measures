const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'global',
    password: process.env.DB_PASSWORD || '12345678',
    port: process.env.DB_PORT || 5432,
});

//Function to save data to PostgreSQL
// const saveToDatabase = async (data) => {
//     try {
//         const client = await pool.connect();
//         for (let i= 0; i < data.length; i++) {
//             await client.query(
//                 'INSERT INTO occupations (name) VALUES ($1)',
//                 [data[i]]
//             );
//         }
//         client.release();
//         console.log('Data saved to database.');
//     } catch (err) {
//         console.error('Error saving to database:', err);
//     }
// };

// const businessSectors = [
//     "Информационные технологии (IT)",
//     "Электронная коммерция",
//     "Образование",
//     "Здравоохранение",
//     "Финансы и инвестиции",
//     "Ритейл",
//     "Производство",
//     "Энергетика",
//     "Строительство и недвижимость",
//     "Логистика и транспорт",
//     "Сельское хозяйство",
//     "Медиа и развлечения",
//     "Туризм и гостиничный бизнес",
//     "Реклама и маркетинг",
//     "Наука и исследования",
//     "Юриспруденция",
//     "Производство продуктов питания и напитков",
//     "Спорт и фитнес",
//     "Экология и переработка отходов",
//     "Мода и дизайн"
//   ];
// saveToDatabase(businessSectors);

const getNews = async () => {
    try {
        const res = await pool.query('SELECT * FROM occupations');
        console.log(res.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
    }
};

getNews();