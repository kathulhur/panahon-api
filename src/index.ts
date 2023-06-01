import express from 'express'
import path from 'path'
import weatherRouter from './routes/api/weather'
import usersRouter from './routes/api/user';
import AuthRouter from './routes/api/auth';
import ApiKeyRouter from './routes/api/apikey';
import webAuthRouter from './routes/auth';
import bodyParser from 'body-parser';
import { PrismaClient, User } from '@prisma/client';
import { verifyJSONWebToken } from './utils';
import session from 'express-session';
import { generateAPIKey } from './lib/apikey';

declare global {
    namespace Express {
        export interface Request {
            user?: User;
        }
        export interface Locals {
            user?: User;
        }
    }
}


export const prisma = new PrismaClient();

const port = process.env.PORT || 3000


const app = express()
app.set('views', './src/views')
app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(session({
    secret: process.env.JWT_SECRET || 'jksdajf0jJKLf83rhAcvmsj4324FDJFkfda',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 },

}))



app.use(async (req, res, next) => {
    if (!req.session.userId) {
        return next()
    }
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
    next()
})

app.get('/', async (req, res) => {
    return res.render('index')

})

app.get('/dashboard', async (req, res) => {
    if (!res.locals.isAuthenticated) return res.redirect('/auth/login')
    return res.render('dashboard')

})

app.post('/dashboard/:userId/keys/generate', async (req, res) => {
    if (!res.locals.isAuthenticated || !res.locals.user) return res.redirect('/auth/login')
    
    const storedApiKey = await prisma.apiKey.findUnique({
        where: {
            userId: res.locals.user.id
        }
    })

    if (storedApiKey) {
        const updatedKey = await prisma.apiKey.update({
            where: {
                userId: res.locals.user.id
            },
            data: {
                key:  generateAPIKey(),
                deleted: false,
            }
        })
        return res.redirect('/dashboard')
    }
    

    const newAPIKey = await prisma.apiKey.create({
        data: {
            key: generateAPIKey(),
            user: {
                connect: {
                    id: res.locals.user.id
                }
            }

        },
    })

    return res.redirect('/dashboard')
})



app.post('/dashboard/:userId/keys/regenerate', async (req, res) => {
    if (!res.locals.isAuthenticated || !res.locals.user) return res.redirect('/auth/login')
    
    const updatedKey = await prisma.apiKey.update({
        where: {
            userId: res.locals.user.id
        },
        data: {
            key:  generateAPIKey(),
        }
    })

    return res.redirect('/dashboard')
})

app.post('/dashboard/:userId/keys/delete', async (req, res) => {
    if (!res.locals.isAuthenticated || !res.locals.user) return res.redirect('/auth/login')
    
    const deletedApiKey = await prisma.apiKey.update({
        where: {
            userId: res.locals.user.id
        },
        data: {
            deleted: true,
            deletedAt: new Date()
        }
    })

    return res.redirect('/dashboard')
})




app.use('/auth', webAuthRouter)


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