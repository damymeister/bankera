/**
 * Create API endpoint URL
 * @param endpoint - API Endpoint
 * @returns Full URL path
 * @example
 * api_url('login') returns 'http://localhost:3000/api/login'
 * api_url('auth/user') returns 'http://localhost:3000/api/auth/user'
 */
export default function api_url (endpoint: string) {
    return hostnamePrefix() + endpoint
}

const hostnamePrefix = () => {
    if (process.env.NEXT_PUBLIC_NET_TYPE !== undefined) {
        if (process.env.NEXT_PUBLIC_NET_TYPE === 'LOCAL' && process.env.NEXT_PUBLIC_LOCAL_API) return process.env.NEXT_PUBLIC_LOCAL_API
        if (process.env.NEXT_PUBLIC_NET_TYPE === 'REMOTE' && process.env.NEXT_PUBLIC_REMOTE_API) return process.env.NEXT_PUBLIC_REMOTE_API
    }
    if (process.env.NEXT_PUBLIC_PORT !== undefined) return 'http://localhost:' + process.env.NEXT_PUBLIC_PORT + '/api/'
    return 'http://localhost:3000/api/'
}