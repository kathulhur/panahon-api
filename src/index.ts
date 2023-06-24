import express from 'express'
import apiRouter from './routes/api';
import webAuthRouter from './routes/web/auth';
import bodyParser from 'body-parser';
import { PrismaClient, User } from '@prisma/client';
import session from 'express-session';
import dashboardRouter from './routes/web/dashboard';
import cors from 'cors'

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
        export interface Locals {
            user?: User;
            isAuthenticated?: boolean;
            isAdmin?: boolean;
        }
    }
}


export const prisma = new PrismaClient();

const port = process.env.PORT || 5000


const app = express()
app.set('views', './src/views')
app.set('view engine', 'pug')
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))

app.use(session({
    secret: process.env.JWT_SECRET || 'jksdajf0jJKLf83rhAcvmsj4324FDJFkfda',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },

}))

app.use(async (req, res, next) => {
    if (req.session.userId) {// if session exists, get user from db
        const user = await prisma.user.findUnique({
            where: {
                id: req.session.userId
            },
            include: {
                keys: true
            }
        })

        if (!user) {
            return next()
        }
        user.keys = user.keys.filter(key => !key.deleted)

        res.locals.user = user
        res.locals.isAuthenticated = true
        return next()
    }
    return next();
})

app.get('/', async (req, res) => {
    return res.render('index')

})
app.use('/auth', webAuthRouter)
app.use('/dashboard', dashboardRouter)
app.use('/api', apiRouter)


app.listen(port, () => {
    console.log(`Application running on port ${port}`)
})