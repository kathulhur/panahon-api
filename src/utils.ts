// Description: This file contains all the utility functions used in the application.

import { User } from "@prisma/client";
import { WeatherData } from "./types";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const transformWeatherData = (data: any): WeatherData => {
    const { location, current } = data;
    const { name, region, country, localtime } = location;
    const { temp_c, condition } = current;
    return {
        location: {
            name,
            region,
            country,
            localtime
        },
        current: {
            temp_c,
            condition: {
                text: condition.text,
                icon: condition.icon
            }
        }
    }
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

