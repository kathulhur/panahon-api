import { Router } from 'express'
const router = Router()
import { prisma } from '../../index'


router.get('/', async (req, res) => {
    const users = await prisma.user.findMany({
        where : {
            deleted: false
       }
    })

    return res.json({
        message: "Users retrieved successfully",
        status: 200,
        data: users
    });
})


router.post('/', async (req, res) => {
    const { name, email, password } = req.body;
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password
        }
    })

    return res.json({
        message: "User created successfully",
        status: 200,
        data: {
            name: user.name,
            email: user.email,
        }
    });
})

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await prisma.user.update({
        where: {
            id
        },
        data: {
            name,
            email,
            password
        },
    })

    return res.json({
        message: "User updated successfully",
        status: 200,
        data: {
            name: user.name,
            email: user.email,
        }
    });
})


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const user = await prisma.user.update({
        where: {
            id
        },
        data: {
            deleted: true
        },
    })

    return res.json({
        message: "User deleted successfully",
        status: 200,
        data: {
            name: user.name,
            email: user.email,
        }
    });
})


export default router;