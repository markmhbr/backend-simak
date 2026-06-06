declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test"
}
declare class EnvironmentVariables {
    NODE_ENV: Environment;
    PORT?: string;
    APP_URL: string;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRATION: string;
    JWT_REFRESH_SECRET: string;
    JWT_REFRESH_EXPIRATION: string;
    ENCRYPTION_KEY: string;
    REDIS_HOST: string;
    REDIS_PORT: number;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
export {};
