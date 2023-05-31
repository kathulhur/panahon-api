import express from 'express'
import path from 'path'
import weatherRouter from './routes/weather'
import usersRouter from './routes/user';
import AuthRouter from './routes/auth';
import ApiKeyRouter from './routes/apikey';
import bodyParser from 'body-parser';
import { PrismaClient, User } from '@prisma/client';
import { verifyJSONWebToken } from './utils';

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
    }
}


export const prisma = new PrismaClient();

const port = process.env.PORT || 3000


const app = express()



app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'views', 'index.html'))

})

app.use(bodyParser.json())

app.use('/api/auth', AuthRouter)
app.use('/api/weather', weatherRouter)

app.use( async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            status: 401,
        });
    }

    try {
        const tokenData = verifyJSONWebToken(token);
        const { email } = tokenData as  { email: string };
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
                status: 401,
            });
        }
        req.user = user;

    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
            status: 401,
        });
    }

    
    next();

})
app.use('/api/users', usersRouter)
app.use('/api/keys', ApiKeyRouter)



app.listen(port, () => {
    console.log(`Application running on port ${port}`)
})