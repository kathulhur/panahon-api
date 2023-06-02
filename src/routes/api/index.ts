import { Router } from 'express'
import authRouter from './auth'
import userRouter from './user'
import apiKeyRouter from './apikey'
import weatherRouter from './weather'
import { verifyJSONWebToken } from '../../utils'
import { prisma } from '../..'
import { Role } from '@prisma/client'
const router = Router()

// unprotected routes (no bearer token required)
router.use('/auth', authRouter)
router.use('/weather', weatherRouter)



router.use(async (req, res, next) => {
    console.log('auth middleware')
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) { // if no token, return unauthorized
        return res.status(401).json({
            message: "Unauthorized",
            status: 401,
        });
    }

    try {   // if token exists, verify token and get user from db
        const tokenData = verifyJSONWebToken(token);
        const { email } = tokenData as { email: string };

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) { // if user doesn't exist, return unauthorized
            return res.status(401).json({
                message: "Unauthorized",
                status: 401,
            });
        }

        res.locals.user = user;
        res.locals.isAuthenticated = true;
        if (user.role === Role.ADMIN) {
            res.locals.isAdmin = true;
        }
        
    } catch (error) { // if token is invalid, return unauthorized
        return res.status(401).json({
            message: "Unauthorized",
            status: 401,
        });
    }

    return next();
})

// protected by bearer token authentication
router.use('/users', userRouter)
router.use('/keys', apiKeyRouter)



export default router
