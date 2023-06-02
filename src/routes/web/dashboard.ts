import { Router } from 'express'
import { prisma } from '../..'
import { generateAPIKey } from '../../lib/apikey'
import { isUserAuthenticated } from './auth'
import axios from 'axios'

const router = Router()


router.get('/', isUserAuthenticated, async (req, res) => {
    if (!res.locals.user) return res.redirect('/auth/login')
    
    const { city } = req.query;
    if (!city) return res.render('dashboard')

    const apiKey = await prisma.apiKey.findUnique({
        where: {
            userId: res.locals.user.id
        }
    })

    if (!apiKey) return res.render('dashboard', { error: 'You need to generate an API key first' })
    
    // TODO: catch error
    const response = await axios.get(`http://localhost:3000/api/weather/${city}?key=${apiKey.key}`)

    return res.render('dashboard', { result: JSON.stringify(response.data, null, 4) })

})

router.post('/:userId/key/generate', async (req, res) => {
    if (!res.locals.user) return res.redirect('/auth/login')

    
    try {
        await prisma.apiKey.create({
            data: {
                key: generateAPIKey(),
                user: {
                    connect: {
                        id: res.locals.user.id
                    }
                }
    
            },
        })
    } catch (error) {
        console.log(error)
    }

    return res.redirect('/dashboard')
})



router.post('/:userId/key/regenerate', async (req, res) => {
    if (!res.locals.user) return res.redirect('/auth/login')
    
    try {
        await prisma.apiKey.update({
            where: {
                userId: res.locals.user.id
            },
            data: {
                key:  generateAPIKey(),
            }
        })
    } catch (error) {
        console.log(error)
    }

    return res.redirect('/dashboard')
})

router.post('/:userId/key/delete', async (req, res) => {
    if (!res.locals.user) return res.redirect('/auth/login')
    
    try {
        await prisma.apiKey.delete({
            where: {
                userId: res.locals.user.id
            },
        })
    } catch (error) {
        console.log(error)

    }


    return res.redirect('/dashboard')
})


export default router;