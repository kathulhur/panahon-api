
import { Router } from 'express';
import { prisma } from '../index';
import { generateAPIKey } from '../lib/apikey';
const router = Router();

router.get('/', async (req, res) => {
    if (!req.user) {
        return res.json({
            message: "Unauthorized",
            status: 401,
        });
    }

    const apiKeys = await prisma.apiKey.findMany({
        where: {
            userId: req.user.id
        }
    })
    
    return res.json({
        message: "API keys found",
        status: 200,
        data: apiKeys
    });
})

router.get('/:id', async (req, res) => {
    if (!req.user) {
        return res.json({
            message: "Unauthorized",
            status: 401,
        });
    }

    const apiKey = await prisma.apiKey.findUnique({
        where: {
            userId: req.user.id
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
    if (!req.user) {
        return res.json({
            message: "User not found",
            status: 404,
        });
    }
    
    const generatedApiKey = generateAPIKey();
    
    const newApiKey = await prisma.apiKey.create({
        data: {
            key: generatedApiKey,
            user: {
                connect: {
                    id: req.user.id
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


router.put('/', async (req, res) => {

    if (!req.user) {
        return res.json({
            message: "Unauthorized",
            status: 401,
        });
    }

    const apiKey = await prisma.apiKey.findUnique({
        where: {
            userId: req.user.id
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
            userId: req.user.id
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
    
    if (!req.user) {
        return res.json({
            message: "Unauthorized",
            status: 401,
        });
    }

    const apiKey = await prisma.apiKey.findUnique({
        where: {
            userId: req.user.id
        }
    })

    if (!apiKey) {
        return res.json({
            message: "API key not found",
            status: 404,
        });
    }


    await prisma.apiKey.update({
        where: {
            userId: req.user.id
        },
        data: {
            deletedAt: new Date()
        }
    })

    return res.json({
        message: "API key deleted successfully",
        status: 200,
    });

})
    
function getApiPrefix(apiKey: string) {
    const dotIndex = apiKey.indexOf('.');
    if (dotIndex !== -1) {
      return apiKey.slice(0, dotIndex);
    }
    return apiKey;
}


export default router;