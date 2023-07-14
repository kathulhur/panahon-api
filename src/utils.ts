// Description: This file contains all the utility functions used in the application.

import { User } from "@prisma/client";
import { Location, Forecastday, WeatherAPIResponseObject,} from "./types";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


export const filterForecastObject = (data: WeatherAPIResponseObject) => {
    return {
        location: filterLocationField(data.location),
        forecast: filterForecastField(data.forecast.forecastday)
    }
}

export const filterLocationField = (location: Location) => {
    const { name, region, country, localtime } = location
    return {
        name,
        region,
        country,
        localtime
    }
}

export const filterForecastField = (forecastday: Forecastday[]) => {
    const transformedData = forecastday.map((forecast) => {
        const { date, day } = forecast

        const { avgtemp_c, avgtemp_f, condition, daily_chance_of_rain, daily_will_it_rain } = day;
        const largerIcon = condition.icon.replace('64x64', '128x128');
        return {
            date,
            day: {
                avgTempC: avgtemp_c,
                avgTempF: avgtemp_f,
                dailyChanceOfRain: daily_chance_of_rain,
                dailyWillItRain: daily_will_it_rain,
                condition: {
                    text: condition.text,
                    icon: largerIcon
                }
            }
        }

    })
    return transformedData;
}



export const createJSONWebToken = (data: Pick<User, 'email'>) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not found in .env file');
    }
    return jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: '1h',

    })
}

export const verifyJSONWebToken = (token: string) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not found in .env file');
    }
    return jwt.verify(token, process.env.JWT_SECRET)
}

export const hashPassword = async (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
}

