/**
 * Create API endpoint URL
 * @param endpoint - API Endpoint
 * @returns Full URL path
 * @example
 * api_url('login') returns 'http://localhost:3000/api/login'
 * api_url('auth/user') returns 'http://localhost:3000/api/auth/user'
 */
export default function api_url (endpoint: string) {
    if (process.env.API === undefined) return 'http://localhost:3000/api/' + endpoint
    return process.env.API + endpoint
}