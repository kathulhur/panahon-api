declare global {
  namespace NodeJS {
      interface ProcessEnv {
        // Define your custom environment variables here
        JWT_SECRET: string;
      }
    }

}