export interface Label {
    id: string;
    name: string;
    color: string;
}

export interface LabelResponseDto {
    success: boolean;
    message: string;
    data: Label[];
}
