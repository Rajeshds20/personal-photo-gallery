const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/userRoute');
const imageRoute = require('./routes/imageRoute');
const connectDB = require('./config/db');

const app = express();

app.use(express.json());
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
));
app.use(cookieParser());
dotenv.config();

connectDB();

const port = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('Hello from Personal Photo Gallery App'));

app.use('/user', userRoute);
app.use('/image', imageRoute);

app.listen(port, () => console.log(`Photo Gallery App listening on port ${port}!`));