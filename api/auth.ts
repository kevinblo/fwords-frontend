import {loginUser as apiLoginUser, registerUser as apiRegisterUser} from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  is_email_verified?: boolean;
  created_at?: string;
  native_language: any;
  active_language: any;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

interface LoginApiResponse {
  message: string;
  user: {
    id: number;
    email: string;
    username: string;
    is_email_verified: boolean;
    created_at: string;
  };
  tokens: {
    refresh: string;
    access: string;
  };
}

// loginUser с использованием loginUserApi и сохранением ключей в sessionStorage
export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const data: LoginApiResponse = await apiLoginUser(email, password);

  console.log('[DEBUG] Login API response:', data);

  // Transform the API response to match our User interface
  const user: User = {
    id: data.user.id.toString(),
    name: data.user.username || data.user.email,
    email: data.user.email,
    username: data.user.username,
    is_email_verified: data.user.is_email_verified,
    created_at: data.user.created_at,
    native_language: undefined,
    active_language: undefined,
  };

  return {
    user,
    accessToken: data.tokens.access,
    refreshToken: data.tokens.refresh,
  };
}

// Register function with real API call
export async function registerUser(
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  interfaceLanguage: string = 'en'
): Promise<AuthResponse> {
  try {
    // Используем метод из api.ts
    const data = await apiRegisterUser(name, email, password, confirmPassword, interfaceLanguage);

    // Transform response to match expected AuthResponse format
    return {
      accessToken: "",
      refreshToken: "",
      user: {
        id: data.email, // Using email as ID since server doesn't provide separate ID
        name: data.name,
        email: data.email,
        native_language: undefined,
        active_language: undefined
      }
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Registration failed');
  }
}

// Real token refresh function
export async function refreshToken(refreshToken: string): Promise<RefreshResponse> {
  if (!refreshToken) {
    throw new Error('Refresh token is required');
  }
  
  const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[DEBUG] Token refresh failed:', response.status, errorText);
      
      // Check if refresh token is also expired/invalid
      try {
        const errorJson = JSON.parse(errorText);
        if (
          errorJson?.code === 'token_not_valid' ||
          (errorJson?.detail && errorJson.detail.toLowerCase().includes('token'))
        ) {
          console.log('[DEBUG] Refresh token is also expired, triggering logout');
          // Import and call the global token expiration handler
          const { default: AsyncStorage } = await import('@react-native-async-storage/async-storage');
          await AsyncStorage.multiRemove(['user', 'accessToken', 'refreshToken']);
          
          // Clear web storage if available
          if (typeof sessionStorage !== 'undefined') {
            sessionStorage.clear();
          }
          if (typeof localStorage !== 'undefined') {
            localStorage.clear();
          }
          
          // Import router dynamically to avoid circular dependencies
          const { router } = await import('expo-router');
          router.replace('/auth/login');
        }
      } catch (e) {
        // Ignore JSON parse errors
      }
      
      throw new Error(`Failed to refresh token: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('[DEBUG] Token refresh response:', data);
    
    return {
      accessToken: data.access,
      refreshToken: data.refresh || refreshToken,
    };
  } catch (error) {
    console.error('[DEBUG] Token refresh error:', error);
    throw new Error(error instanceof Error ? error.message : 'Token refresh failed');
  }
}