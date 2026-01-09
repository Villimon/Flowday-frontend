export type LoginDto = {
    email: string;
    password: string;
};

export type LoginResponse = {
    success: boolean;
    message: string;
    data: {
        id: string;
        email: string;
        name: string;
        token: string;
    };
};
