export type RegisterDto = {
    email: string;
    password: string;
    name: string;
};

export type RegisterResponse = {
    success: boolean;
    message: string;
    data: {
        id: string;
        email: string;
        name: string;
        token: string;
    };
};
