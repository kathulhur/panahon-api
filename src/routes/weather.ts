const express = require('express')
const router = express.Router()
import axios, { AxiosError } from 'axios'
import { transformWeatherData } from '../utils';
import { Request, Response } from 'express';

const WEATHER_API_KEY = 'b6406bb24a6f438da49151231232805';
const WEATHER_API_BASE_URL = 'https://api.weatherapi.com/v1';
const WEATHER_API_CURRENT = '/current.json'


router.get('/', async (req: Request, res: Response) => {
    res.status(400).json({
        message: 'Bad request. Missing city query parameter'
    });
    return;

});

router.get('/:city', async (req: Request, res: Response) => {
    const { city } = req.params;

    if (!city) {
        res.status(400).json({
            message: 'Missing city query parameter'
        });
        return;
    }


    const API_URL = WEATHER_API_BASE_URL + WEATHER_API_CURRENT;

    try {

        const response = await axios.get(`${API_URL}?key=${WEATHER_API_KEY}&q=${city}`);
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
