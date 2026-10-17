
import { NextRequest, NextResponse } from "next/server";

import { decodeJwt } from "jose";

function deleteToken(request: NextRequest) {
    const response = NextResponse.redirect(
        new URL("/", request.url)
    );
    response.cookies.delete("access_token");
    return response;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get("access_token")?.value;

    if (!token) {
        if (pathname == '/login') {
            return NextResponse.next();
        }
        return NextResponse.redirect(
            new URL("/", request.url)
        );
    }

    const payload = decodeJwt<{type:'agent' | 'client', chat_id:string | undefined}>(token)

    const now = Math.floor(Date.now() / 1000);

    if (!payload.exp || payload.exp <= now) { return deleteToken(request); }

    const chatClient = `/chat/${payload.chat_id}`

    if (payload.type == 'client' && pathname != chatClient) {
        if (!payload.chat_id) {
            return NextResponse.redirect(
                new URL("/", request.url)
            );
        }
        return NextResponse.redirect(
            new URL(`/chat/${payload.chat_id}`, request.url)
        );
    }

    if (pathname == '/login') {
        return NextResponse.redirect(
            new URL(`/chat`, request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/chat/:path*", "/login", "/login/:path*"],
};
