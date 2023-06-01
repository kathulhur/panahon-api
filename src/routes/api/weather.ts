import express from 'express'
const router = express.Router()
import { hashPassword, transformWeatherData } from '../../utils'
import { Request, Response } from 'express'
import axios, { AxiosError } from 'axios'
import { prisma } from '../../'

router.get('/', async (req: Request, res: Response) => {
    res.status(400).json({
        message: 'Bad request. Missing city query parameter'
    });
    return;

});

router.get('/:city', async (req: Request, res: Response) => {
    const { city } = req.params;
    const { key } = req.query;

    if (!city) {
        res.status(400).json({
            message: 'Missing city query parameter'
        });
        return;
    }

    if (!key) {
        res.status(400).json({
            message: 'Missing key query parameter'
        });
        return;
    }

    if (typeof key !== 'string') {
        res.status(400).json({
            message: 'Invalid key query parameter'
        });
        return;
    }


    const apiKey = await prisma.apiKey.findUnique({
        where: {
            key: key
        }
    })

    if (!apiKey) {
        res.status(401).json({
            message: 'Unauthorized',
            status: 401
        });
        return;
    }

    const WEATHER_API_KEY = process.env.WEATHER_API_KEY
    const WEATHER_API_BASE_URL = process.env.WEATHER_API_BASE_URL

    try {
        const response = await axios.get(`${WEATHER_API_BASE_URL}?key=${WEATHER_API_KEY}&q=${city}`);
        const responseData = transformWeatherData(response.data);
        res.json({
            data: responseData,
            message: response.statusText,
            status: response.status
        });

    } catch (e) {
        
        const error = e as AxiosError;
        res.status(error.response?.status || 500).json({
            message: error.message
        });
    }
    
});

export default router;
