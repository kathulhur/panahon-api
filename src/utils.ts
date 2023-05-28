// Description: This file contains all the utility functions used in the application.

import { WeatherData } from "./types";

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