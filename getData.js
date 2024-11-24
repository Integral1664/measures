const pool = require('./db');

const getNews = async () => {
    try {
        const res = await pool.query('SELECT * FROM measures');
        console.log(res.rows);
    } catch (err) {
        console.error('Error fetching users:', err);
    }
};

getNews();