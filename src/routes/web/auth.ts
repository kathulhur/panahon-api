import { Handler, Router } from "express";
import { prisma } from "../..";
import { comparePassword, hashPassword, verifyJSONWebToken } from "../../utils";

declare module 'express-session' {
        interface SessionData {
            userId: string;
        }
    }
const router = Router()

router.get('/login', async (req, res) => {
    return res.render('auth/login')
})


router.post('/logout', async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                message: "Internal Server Error",
                status: 500,
            });
        }
        res.clearCookie('connect.sid')
        return res.redirect('/auth/login');
    })
})


router.post('/login', async (req, res) => {
    const { email, password } = req.body as { email: string, password: string }
    
    if (!email || !password) return res.render('auth/login', {
        error: 'Invalid email or password'
    })

    if (req.session.userId) return res.redirect('/')

    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    
    if (!user) {
        return res.render('auth/login', {
            error: 'Invalid email or password'
        })
    }
    
    if (!(await comparePassword(password, user.password))) {
        return res.render('auth/login', {
            error: 'Invalid email or password'
        })
    }
    
    req.session.userId = user.id

    return res.redirect('/dashboard')
})


router.get('/signup', (req, res) => {

    return res.render('auth/signup')
})

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body as { name: string, email: string, password: string }
    if (!name || !email || !password) return res.render('/auth/signup', {
        error: 'Invalid email or password'
    })

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: await hashPassword(password)
        }
    })

    
    return res.redirect('/auth/login')
})

export const isUserAuthenticated: Handler  = async (req, res, next) => {
    if (!res.locals.isAuthenticated || !res.locals.user) {
       return res.redirect('/auth/login')
    }

    return next();
}



export default router