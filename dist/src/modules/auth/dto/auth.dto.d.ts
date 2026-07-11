export declare class LoginDto {
    username: string;
    password: string;
}
export declare class Verify2faDto {
    tempToken: string;
    code: string;
    secret?: string;
}
