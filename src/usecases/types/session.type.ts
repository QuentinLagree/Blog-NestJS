import { UserSession } from "src/database/entities/user/user.dto";

export type SessionType = {
    loggedIn: boolean;
    user?: UserSession,
}