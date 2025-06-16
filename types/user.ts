import {Language} from '@/types/language';

// User profile interface
export interface User {
    id: number;
    name: string;
    email: string;
    username?: string;
    is_email_verified?: boolean;
    created_at?: string;
    confirmed?: boolean;
    interface_language?: number | Language;
    native_language?: number | Language;
    active_language?: number | Language;
    notify?: boolean;
}
