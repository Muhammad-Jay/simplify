"use server";

import { liveblocks } from "@/lib/liveblocks/liveblocks.config";
import { User } from "@/types/data";
import {getCurrentUserFromDB} from "@/lib/database";
import {getRandomColor} from "@/lib/utils";

export async function authorizeLiveblocks() {
    // Get current session from NextAuth
    const session = await getCurrentUserFromDB();

    // Anonymous user info
    const anonymousUser: User = {
        id: "anonymous",
        name: "Anonymous",
        color: "#ff0000",
        groupIds: [],
    };

    // Get current user info from session (defined in /auth.config.ts)
    // If no session found, this is a logged out/anonymous user
    const {
        username,
        user_id,
        email,
    } = session ?? anonymousUser;

    // const groupIdsWithDraftsGroup = [...groupIds, getDraftsGroupName(id)];

    // Get Liveblocks ID token
    const { status, body } = await liveblocks.identifyUser(
        {
            userId: email,
            groupIds: []
        },
        {
            userInfo: {
                name: username,
                color: getRandomColor(),
            },
        }
    );

    if (status !== 200) {
        return {
            error: {
                code: 401,
                message: "No access",
                suggestion: "You don't have access to this Liveblocks room",
            },
        };
    }

    if (!body) {
        return {
            error: {
                code: 404,
                message: "ID token issue",
                suggestion: "Contact an administrator",
            },
        };
    }

    return { data: JSON.parse(body) };
}