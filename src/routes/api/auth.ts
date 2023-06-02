import { Handler, Router } from 'express'
import { prisma } from '../../index'
import { comparePassword, createJSONWebToken, hashPassword } from '../../utils'
const router = Router()


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    
    if (!user) {
        return res.json({
            message: "Invalid credentials",
            status: 404,
        });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
        return res.json({
            message: "Invalid credentials",
            status: 404,
        });
    }
    

    return res.json({
        message: "User logged in successfully",
        status: 200,
        data: {
            id: user.id,
            name: user.name,
            token: createJSONWebToken({ email: user.email })
        }
    });
})


router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({
            message: "Bad Request",
            status: 400,
        });
    }

    const storedUser = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (storedUser) {
        return res.json({
            message: "User already exists",
            status: 409,
        });
    }

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: await hashPassword(password)
        }
    })

    return res.json({
        message: "Registration successful",
        status: 200,
        data: {
            name: user.name,
            email: user.email,
        }
    });
})


export const isUserAdmin: Handler = async (req, res, next) => {
    console.log('isUserAdmin')
    if (!res.locals.isAdmin) {
        return res.json({
            message: "Unauthorized",
            status: 401,    
        });
    }

    return next();
}

        

    


export default router;