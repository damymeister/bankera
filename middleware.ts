import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import api_url from '@/lib/api_url'

// This fetches the privilege (Axios cannot be used in middleware)
const getPrivilege = async (token: string) => {
    const url = api_url('privilege?token=' + token)
    let privilege_value = await fetch(url, {
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
    return privilege_value
}

/**
 * Privilege table
 * Each element is an object with path fragment and privilege value
 */
const privilegeTable : {path: string, value: number}[] = [
    {path: '/api/auth/', value: 1},
    {path: '/user/', value: 1},
    {path: '/dashboard', value: 1},
    {path: '/api/auth/redaktor/', value: 2},
    {path: '/admin/', value: 3},
    {path: '/api/auth/admin/', value: 3},
]

export async function middleware(request: NextRequest) {
    let privilege_required = 0 // Minimum level of privilege to access the endpoint
    for (let i = 0; i < privilegeTable.length; i++) {
        if (request.nextUrl.pathname.includes(privilegeTable[i].path)) {
            if (privilegeTable[i].value > privilege_required) privilege_required = privilegeTable[i].value
        }
    }
    // Every authorized query should contain a token either by cookie or by searchParams
    let token = request.cookies.get('token')                    // by cookie
    let token_old = request.nextUrl.searchParams.get('token')   // by url param ?token=
    // No token - no Auth
    if (token === undefined && token_old === null) {
        console.log(`[Mid]No token - Privilege: 0. Denying access to ${request.nextUrl.pathname}`,)
        return NextResponse.redirect(new URL('/', request.url))
    }
    // Determine which one is available
    let token_value = ''
    if (token !== undefined) token_value = token.value
    else if (token_old !== null) token_value = token_old
    // Get privilege value
    let user_privilege = await getPrivilege(token_value).then((privilege_value) => {
        return privilege_value
    })
    // Privilege less than threshold - No Auth
    if (user_privilege < privilege_required) {
        console.log(`[Mid] Privilege ${user_privilege}, Denying access to: ${request.nextUrl.pathname}`)
        return NextResponse.redirect(new URL('/', request.url))
    }
    // Otherwise it passes through
    console.log(`[Mid] Privilege ${user_privilege}, Accessing: ${request.nextUrl.pathname}`)
}

// Middleware configuration
export const config = {
    // Add paths here that need to be controlled by middleware
    matcher: ['/:path*'],
}
