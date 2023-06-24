import express from 'express'
import { Request, Response } from 'express'
import axios, { AxiosError } from 'axios'
import { prisma } from '../../'
import { filterForecastObject } from '../../utils'
const router = express.Router()

router.get('/', async (req, res) => {
    return res.status(400).json({
        message: 'Bad request. Invalid endpoint. Please refer to the documentation'
    });
});


router.get('/forecast/3/:location', async (req, res) => {
    console.log('/forecast/3/:location')

    const { location } = req.params;
    const { key } = req.query;
    if (!location) {
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
            message: 'missing key query parameter',
            status: 401
        });
        return;
    }

    const WEATHER_API_KEY = process.env.WEATHER_API_KEY

    const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}&days=7&aqi=no&alerts=no`
    try {
        const response = await axios.get(url);
        const responseData = filterForecastObject(response.data);
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
