/* Copyright (c) 2021, VRAI Labs and/or its affiliates. All rights reserved.
 *
 * This software is licensed under the Apache License, Version 2.0 (the
 * "License") as published by the Apache Software Foundation.
 *
 * You may not use this file except in compliance with the License. You may
 * obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

/*
 * Imports.
 */
import React, { useEffect, useState, useContext, useRef } from "react";
import SessionContext, { isDefaultContext } from "./sessionContext";
import Session from "./recipe";
import { Grant, RecipeEventWithSessionContext, SessionContextType } from "./types";

// if it's not the default context, it means SessionAuth from top has
// given us a sessionContext.
const hasParentProvider = (ctx: SessionContextType) => !isDefaultContext(ctx);

type PropsWithoutAuth = {
    requireAuth?: false;
};

type PropsWithAuth = {
    requireAuth: true;
    redirectToLogin: () => void;
};

type Props = (PropsWithoutAuth | PropsWithAuth) & {
    requiredGrants?: Grant[];
    onSessionExpired?: () => void;
};

const SessionAuth: React.FC<Props> = ({ children, ...props }) => {
    if (props.requireAuth === true && props.redirectToLogin === undefined) {
        throw new Error("You have to provide redirectToLogin or onSessionExpired function when requireAuth is true");
    }
    const requireAuth = useRef(props.requireAuth);

    if (props.requireAuth !== requireAuth.current) {
        throw new Error("requireAuth prop should not change.");
    }

    const parentSessionContext = useContext(SessionContext);

    // assign the parent context here itself so that there is no flicker in the UI
    const [context, setContext] = useState<SessionContextType | undefined>(
        hasParentProvider(parentSessionContext) ? parentSessionContext : undefined
    );

    const session = useRef(Session.getInstanceOrThrow());

    // on mount
    useEffect(() => {
        const cancelUseEffect = new AbortController();

        const checkGrants = async (context: SessionContextType) => {
            // We are checking all required grants even if one fails
            // We may not want to redirect on the first failed one, e.g.:
            // MFA fails, which would show a popup, but email verified also fails which redirects.
            let retVal = true;
            if (props.requiredGrants !== undefined) {
                for (const grant of props.requiredGrants) {
                    let passes = await grant.checkPayload(context.accessTokenPayload, cancelUseEffect.signal);
                    if (cancelUseEffect.signal.aborted) {
                        return false;
                    }
                    if (passes === undefined) {
                        passes = await grant.checkAPI(cancelUseEffect.signal);
                        if (cancelUseEffect.signal.aborted) {
                            return false;
                        }
                    }
                    if (passes !== true) {
                        await grant.onFailedCheck({ history }, cancelUseEffect.signal);
                        retVal = false;
                        if (cancelUseEffect.signal.aborted) {
                            return false;
                        }
                    }
                }
            }
            return retVal;
        };

        const buildContext = async (): Promise<SessionContextType> => {
            if (hasParentProvider(parentSessionContext)) {
                return parentSessionContext;
            }

            const sessionExists = await session.current.doesSessionExist();

            if (sessionExists === false) {
                return {
                    doesSessionExist: false,
                    accessTokenPayload: {},
                    userId: "",
                };
            }

            return {
                doesSessionExist: true,
                accessTokenPayload: await session.current.getAccessTokenPayloadSecurely(),
                userId: await session.current.getUserId(),
            };
        };

        async function setInitialContextAndMaybeRedirect() {
            const toSetContext = await buildContext();

            // if this component is unmounting, or the context has already
            // been set, then we don't need to proceed...
            if (cancelUseEffect.signal.aborted) {
                return;
            }

            if (!toSetContext.doesSessionExist && props.requireAuth === true) {
                props.redirectToLogin();
            } else {
                await checkGrants(toSetContext);
                if (context === undefined) {
                    setContext(toSetContext);
                }
            }
        }
        if (context === undefined) {
            void setInitialContextAndMaybeRedirect();
        } else {
            if (context.doesSessionExist) {
                void checkGrants(context);
            } else if (props.requireAuth === true) {
                props.redirectToLogin();
            }
        }
        return () => {
            cancelUseEffect.abort();
        };
    }, []);

    // subscribe to events on mount
    useEffect(() => {
        function onHandleEvent(event: RecipeEventWithSessionContext) {
            switch (event.action) {
                case "SESSION_CREATED":
                    setContext(event.sessionContext);
                    return;
                case "REFRESH_SESSION":
                    setContext(event.sessionContext);
                    return;
                case "SIGN_OUT":
                    if (props.requireAuth !== true) {
                        setContext(event.sessionContext);
                    }
                    return;
                case "UNAUTHORISED":
                    if (props.requireAuth === true) {
                        if (props.onSessionExpired !== undefined) {
                            props.onSessionExpired();
                        } else {
                            props.redirectToLogin();
                        }
                    } else {
                        setContext(event.sessionContext);
                        if (props.onSessionExpired !== undefined) {
                            props.onSessionExpired();
                        }
                    }
                    return;
            }
        }

        // we return here cause addEventListener returns a function that removes
        // the listener, and this function will be called by useEffect when
        // onHandleEvent changes or if the component is unmounting.
        return session.current.addEventListener(onHandleEvent);
    }, [props]);

    if (context === undefined) {
        return null;
    }

    // this will display null only if initially the below condition is true.
    // cause if the session goes from existing to non existing, then
    // the context is not updated if props.requireAuth === true
    if (!context.doesSessionExist && props.requireAuth === true) {
        return null;
    }

    return <SessionContext.Provider value={context}>{children}</SessionContext.Provider>;
};

export default SessionAuth;
