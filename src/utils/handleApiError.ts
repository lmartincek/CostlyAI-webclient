import { AxiosError } from 'axios';

export const handleApiError = (error: unknown): string => {
    if (error instanceof AxiosError) {
        return error.response?.data?.error || 'Something went wrong';
    }
    return 'Unexpected error occurred';
};
