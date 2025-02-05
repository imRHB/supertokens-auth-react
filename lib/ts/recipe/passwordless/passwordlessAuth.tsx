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
import { PropsWithChildren } from "react";
import { memo } from "react";
import SuperTokens from "../../superTokens";

import { FeatureBaseProps } from "../../types";
import UserContextWrapper from "../../usercontext/userContextWrapper";
import SessionAuthWrapper from "../session/sessionAuth";
import Passwordless from "./recipe";

type Props = FeatureBaseProps & {
    recipe: Passwordless;
    requireAuth?: boolean;
    onSessionExpired?: () => void;
};

function PasswordlessAuth(props: Props) {
    if (props.requireAuth === false) {
        return <SessionAuthWrapper onSessionExpired={props.onSessionExpired}>{props.children}</SessionAuthWrapper>;
    }

    return (
        <SessionAuthWrapper
            redirectToLogin={() =>
                Passwordless.getInstanceOrThrow().redirectToAuthWithRedirectToPath(undefined, props.history)
            }
            requireAuth={true}
            onSessionExpired={props.onSessionExpired}>
            {props.children}
        </SessionAuthWrapper>
    );
}

const PasswordlessAuthMemo = memo(PasswordlessAuth);

export default function PasswordlessAuthWrapper({
    children,
    requireAuth,
    onSessionExpired,
    userContext,
}: PropsWithChildren<{
    requireAuth?: boolean;
    onSessionExpired?: () => void;
    userContext?: any;
}>) {
    const routerInfo = SuperTokens.getInstanceOrThrow().getReactRouterDomWithCustomHistory();
    const history = routerInfo === undefined ? undefined : routerInfo.useHistoryCustom();

    return (
        <UserContextWrapper userContext={userContext}>
            <PasswordlessAuthMemo
                history={history}
                onSessionExpired={onSessionExpired}
                requireAuth={requireAuth}
                recipe={Passwordless.getInstanceOrThrow()}>
                {children}
            </PasswordlessAuthMemo>
        </UserContextWrapper>
    );
}
