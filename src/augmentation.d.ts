
import { User } from "@prisma/client";

declare global {
  namespace NodeJS {
      interface ProcessEnv {
        // Define your custom environment variables here
        JWT_SECRET: string;
        WEATHER_API_KEY: string;
        WEATHER_API_BASE_URL: string;
      }
    }

}

