
import { Handler, Router } from 'express';
import { prisma } from '../../index';
import { generateAPIKey } from '../../lib/apikey';
import { isUserAdmin } from './auth';

// TODO: Find library for short circuiting handlers

const router = Router();

router.get('/', isUserAdmin,  async (req, res) => {
    console.log('get api keys')
    if (!res.locals.user) {
        return res.json({
            message: "Unauthorized",
            status: 401,
        });
    }

    const apiKeys = await prisma.apiKey.findMany({
        where: {
            userId: res.locals.user.id
        }
    })
    
    return res.json({
        message: "API keys found",
        status: 200,
        data: apiKeys
    });
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!res.locals.user) {
        return res.json({
            message: "Unauthorized",
            status: 401,
        });
    }

    

    const apiKey = await prisma.apiKey.findUnique({
        where: {
            key: id
        }
    })

    if (!apiKey) {
        return res.json({
            message: "API key not found",
            status: 404,
        });
    }


    return res.json({
        message: "API key found",
        status: 200,
        data: {
            apiKey: apiKey.key,
        }
    });
})



router.post('/', async (req, res) => {
    if (!res.locals.user) {
        return res.json({
            message: "Unauthorized",
            status: 401,
        });
    }

    const storedApiKey = await prisma.apiKey.findUnique({
        where: {
            userId: res.locals.user.id
        }
    })

    if (storedApiKey) {
        return res.json({
            message: "API key already exists",
            status: 409,
        });
    }

    const generatedApiKey = generateAPIKey();
    
    const newApiKey = await prisma.apiKey.create({
        data: {
            key: generatedApiKey,
            user: {
                connect: {
                    id: res.locals.user.id
                }
            }
        }
    })


    return res.json({
        message: "API key generated successfully",
        status: 200,
        data: {
            apiKey: newApiKey.key,
            message: "Success",
            status: 200,
        }
    });

})


router.put('/:id', async (req, res) => {

    if (!res.locals.user) {
        return res.json({
            message: "Unauthorized",
            status: 401,
        });
    }


    const apiKey = await prisma.apiKey.findUnique({
        where: {
            id: req.params.id
        }
    })

    if (!apiKey) {
        return res.json({
            message: "API key not found",
            status: 404,
        });
    }

    
    const generatedApiKey = generateAPIKey();
    
    const newApiKey = await prisma.apiKey.update({
        where: {
            id: req.params.id
        },
        data: {
            key: generatedApiKey,
            updatedAt: new Date()
        }
    })

    return res.json({
        message: "API key updated successfully",
        status: 200,
        data: {
            apiKey: newApiKey.key,
            message: "Success",
            status: 200,
        }
    });

})

router.delete('/:id', async (req, res) => {
    
    if (!res.locals.user) {
        return res.json({
            message: "Unauthorized",
            status: 401,
        });
    }

    const apiKey = await prisma.apiKey.findUnique({
        where: {
            id: req.params.id
        }
    })
    
    if (!apiKey) {
        return res.json({
            message: "API key not found",
            status: 404,
        });
    }


    await prisma.apiKey.delete({
        where: {
            id: req.params.id
        }
    })

    return res.json({
        message: "API key deleted successfully",
        status: 200,
    });

})
    


export default router;