import { CanActivate, ExecutionContext, mixin, UnauthorizedException } from "@nestjs/common";

import { FastifyReply, FastifyRequest } from "fastify";
import { Url } from "src/usecases/types/url.types";
import { Message, makeMessage } from "../utils/logger.utils";



export const AuthGuardSession = (urlRedirect?: Url, outputMessage?: Message<String>) => {
    class UserGuardSession implements CanActivate {
        canActivate(context: ExecutionContext): boolean | Promise<boolean> {
            const request: FastifyRequest = context.switchToHttp().getRequest();
            const response: FastifyReply = context.switchToHttp().getResponse();
    
    
            if (!request.session.user) {
                urlRedirect = (!urlRedirect) ? Url.create('/') : urlRedirect
                
                if (outputMessage?.log) {
                    response.send((outputMessage) ? makeMessage(outputMessage?.log, outputMessage.message, outputMessage.data) : makeMessage("Redirect Success", `Redirect to http://${request.headers.host}${urlRedirect}`,
                        null
                    ))
                    response.redirect(urlRedirect.value())
                    throw new UnauthorizedException("Session Invalid/Expired");
                }
            }
            return true;
        }
    
    }

    const guard = mixin(UserGuardSession)
    return guard
}
