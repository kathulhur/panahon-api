import express from 'express'
import path from 'path'
import weatherRouter from './routes/weather'
import usersRouter from './routes/user';
import AuthRouter from './routes/auth';

import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';
import { verifyJSONWebToken } from './utils';
export const prisma = new PrismaClient();

const port = process.env.PORT || 3000


const app = express()

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'views', 'index.html'))

})



app.use(bodyParser.json())

app.use('/api/auth', AuthRouter)

app.use((req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.json({
            message: "Unauthorized",
            status: 401,
        });
    }

    try {
        const tokenData = verifyJSONWebToken(token);
    } catch (error) {
        return res.json({
            message: "Unauthorized",
            status: 401,
        });
    }

    
    next();

})
app.use('/api/weather', weatherRouter)
app.use('/api/users', usersRouter)



app.listen(port, () => {
    console.log(`Application running on port ${port}`)
})