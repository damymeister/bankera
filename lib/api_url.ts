/**
 * Create API endpoint URL
 * @param endpoint - API Endpoint
 * @returns Full URL path
 * @example
 * api_url('login') returns 'http://localhost:3000/api/login'
 * api_url('auth/user') returns 'http://localhost:3000/api/auth/user'
 * @description
 * You can also set variables in .env such as:
 * NEXT_PUBLIC_PORT to define specific port,
 * NEXT_PUBLIC_API to define whole API link
 */
export default function api_url (endpoint: string) {
    if (process.env.NEXT_PUBLIC_API === undefined) {
        return 'http://localhost:' + (process.env.NEXT_PUBLIC_PORT === undefined ? "3000" : process.env.NEXT_PUBLIC_PORT) + '/api/' + endpoint
    }
    return process.env.NEXT_PUBLIC_API + endpoint
}