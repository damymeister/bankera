/**
 * Create API endpoint URL
 * @param endpoint - API Endpoint
 * @returns Full URL path
 * @example
 * api_url('login') returns 'http://localhost:3000/api/login'
 * api_url('auth/user') returns 'http://localhost:3000/api/auth/user'
 */
export default function api_url (endpoint: string) {
    if (process.env.API === undefined) return 'http://localhost:' + (process.env.PORT === undefined ? "3000" : process.env.PORT) + '/api/' + endpoint
    return process.env.API + endpoint
}