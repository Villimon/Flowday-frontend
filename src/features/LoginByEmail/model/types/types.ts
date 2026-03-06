export type LoginRequestDto = {
    email: string;
    password: string;
};

export type LoginResponseDto = {
    success: boolean;
    message: string;
    data: {
        id: string;
        email: string;
        name: string;
        token: string;
    };
};
