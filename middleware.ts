import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import api_url from '@/lib/api_url'

// This fetches the privilege (Axios cannot be used in middleware)
const getPrivilege = async (token: string) => {
    const url = api_url('privilege?token=' + token)
    let v = await fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    }).then(response => response.json())
    .then((data) => {
        return parseInt(data.privilege)
    })
    .catch(error => {
        console.log(error)
        return 0
    })
    return v
}

export async function middleware(request: NextRequest) {
    let callback_ts = 0 // Minimum level of privilege to access the endpoint
    // Define levels of privilege (0 - guest, 1 - user, 2 - redaktor, 3 - admin)
    if (request.nextUrl.pathname.includes('/api/auth/')) callback_ts = 1
    if (request.nextUrl.pathname.includes('/user/')) callback_ts = 1
    if (request.nextUrl.pathname.includes('/dashboard')) callback_ts = 1
    if (request.nextUrl.pathname.includes('/api/auth/redaktor/')) callback_ts = 2
    if (request.nextUrl.pathname.includes('/admin/')) callback_ts = 3
    if (request.nextUrl.pathname.includes('/api/auth/admin/')) callback_ts = 3
    // Every authorized query should contain a token either by cookie or by searchParams
    let token = request.cookies.get('token')                    // by cookie
    let token_old = request.nextUrl.searchParams.get('token')   // by url param ?token=
    // No token - no Auth
    if (token === undefined && token_old === null) {
        console.log(`[Mid]No token - Privilege: 0. Denying access to ${request.nextUrl.pathname}`,)
        return NextResponse.redirect(new URL('/', request.url))
    }
    // Determin which one is available
    let token_value = ''
    if (token !== undefined) token_value = token.value
    else if (token_old !== null) token_value = token_old
    // Get privilege value
    let v = await getPrivilege(token_value).then((v) => {
        return v
    })
    // Privilege less than threshold - No Auth
    if (v < callback_ts) {
        console.log(`[Mid] Privilege ${v}, Denying access to: ${request.nextUrl.pathname}`)
        return NextResponse.redirect(new URL('/', request.url))
    }
    // Otherwise it passes through
    console.log(`[Mid] Privilege ${v}, Accessing: ${request.nextUrl.pathname}`)
}

// Middleware configuration
export const config = {
    // Add paths here that need to be controlled by middleware
    matcher: ['/api/auth/:path*', '/user/:path*', '/admin/:path*'],
}
