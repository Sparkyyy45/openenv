const express = require('express');
const app = express();
app.get('/', (req, res) => res.json({ msg: 'Hello Prisma' }));
app.listen(process.env.PORT || 3000);
