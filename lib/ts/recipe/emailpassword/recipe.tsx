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

import React from "react";
import AuthRecipeWithEmailVerification from "../authRecipeWithEmailVerification";
import { CreateRecipeFunction, RecipeFeatureComponentMap, NormalisedAppInfo } from "../../types";
import {
    GetRedirectionURLContext,
    OnHandleEventContext,
    PreAndPostAPIHookAction,
    Config,
    NormalisedConfig,
    UserInput,
} from "./types";
import { isTest, matchRecipeIdUsingQueryParams } from "../../utils";
import { normaliseEmailPasswordConfig } from "./utils";
import NormalisedURLPath from "supertokens-web-js/utils/normalisedURLPath";
import { DEFAULT_RESET_PASSWORD_PATH } from "./constants";
import { SSR_ERROR } from "../../constants";
import RecipeModule from "../recipeModule";
import SignInAndUp from "./components/features/signInAndUp";
import ResetPasswordUsingToken from "./components/features/resetPasswordUsingToken";
import RecipeImplementation from "./recipeImplementation";
import EmailVerification from "../emailverification/recipe";
import AuthWidgetWrapper from "../authRecipe/authWidgetWrapper";
import WebJSEmailPassword from "supertokens-web-js/lib/build/recipe/emailpassword/recipe";
import { RecipeInterface as WebJsRecipeInterface } from "supertokens-web-js/recipe/emailpassword";

/*
 * Class.
 */
export default class EmailPassword extends AuthRecipeWithEmailVerification<
    GetRedirectionURLContext,
    OnHandleEventContext,
    NormalisedConfig
> {
    static instance?: EmailPassword;
    static RECIPE_ID = "emailpassword";

    recipeImpl: WebJsRecipeInterface;
    webJsRecipe: WebJSEmailPassword;

    constructor(
        config: Config,
        recipes: {
            emailVerificationInstance: EmailVerification | undefined;
        }
    ) {
        super(normaliseEmailPasswordConfig(config), {
            emailVerificationInstance: recipes.emailVerificationInstance,
        });

        {
            this.webJsRecipe = new WebJSEmailPassword(
                {
                    appInfo: config.appInfo,
                    recipeId: config.recipeId,
                    preAPIHook: config.preAPIHook,
                    postAPIHook: config.postAPIHook,
                    override: {
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        functions: (_, builder) => {
                            builder = builder.override((oI) => RecipeImplementation(oI, this.config));
                            if (this.config.override.functions !== undefined) {
                                builder = builder.override(this.config.override.functions);
                            }
                            return builder.build();
                        },
                    },
                },
                {
                    emailVerification:
                        recipes.emailVerificationInstance === undefined
                            ? undefined
                            : recipes.emailVerificationInstance.webJsRecipe,
                }
            );

            this.recipeImpl = this.webJsRecipe.recipeImplementation;
        }
    }

    getFeatures = (): RecipeFeatureComponentMap => {
        const features: RecipeFeatureComponentMap = {};
        if (this.config.signInAndUpFeature.disableDefaultImplementation !== true) {
            const normalisedFullPath = this.config.appInfo.websiteBasePath.appendPath(new NormalisedURLPath("/"));
            features[normalisedFullPath.getAsStringDangerous()] = {
                matches: matchRecipeIdUsingQueryParams(this.config.recipeId),
                component: (props) => this.getFeatureComponent("signinup", props),
            };
        }

        if (this.config.resetPasswordUsingTokenFeature.disableDefaultImplementation !== true) {
            const normalisedFullPath = this.config.appInfo.websiteBasePath.appendPath(
                new NormalisedURLPath(DEFAULT_RESET_PASSWORD_PATH)
            );
            features[normalisedFullPath.getAsStringDangerous()] = {
                matches: matchRecipeIdUsingQueryParams(this.config.recipeId),
                component: (props) => this.getFeatureComponent("resetpassword", props),
            };
        }

        return {
            ...features,
            ...this.getAuthRecipeWithEmailVerificationFeatures(),
        };
    };

    getDefaultRedirectionURL = async (context: GetRedirectionURLContext): Promise<string> => {
        if (context.action === "RESET_PASSWORD") {
            const resetPasswordPath = new NormalisedURLPath(DEFAULT_RESET_PASSWORD_PATH);
            return `${this.config.appInfo.websiteBasePath.appendPath(resetPasswordPath).getAsStringDangerous()}?rid=${
                this.config.recipeId
            }`;
        }

        return this.getAuthRecipeWithEmailVerificationDefaultRedirectionURL(context);
    };

    getFeatureComponent = (
        componentName: "signinup" | "resetpassword" | "emailverification",
        props: any | undefined
    ): JSX.Element => {
        if (componentName === "signinup") {
            return (
                <AuthWidgetWrapper<
                    GetRedirectionURLContext,
                    PreAndPostAPIHookAction,
                    OnHandleEventContext,
                    NormalisedConfig
                >
                    authRecipe={this}
                    history={props.history}>
                    <SignInAndUp recipe={this} {...props} />
                </AuthWidgetWrapper>
            );
        } else if (componentName === "resetpassword") {
            return <ResetPasswordUsingToken recipe={this} {...props} />;
        } else {
            return this.getAuthRecipeWithEmailVerificationFeatureComponent(componentName, props);
        }
    };

    static init(
        config?: UserInput
    ): CreateRecipeFunction<GetRedirectionURLContext, PreAndPostAPIHookAction, OnHandleEventContext, NormalisedConfig> {
        return (
            appInfo: NormalisedAppInfo
        ): RecipeModule<GetRedirectionURLContext, PreAndPostAPIHookAction, OnHandleEventContext, NormalisedConfig> => {
            EmailPassword.instance = new EmailPassword(
                {
                    ...config,
                    appInfo,
                    recipeId: EmailPassword.RECIPE_ID,
                },
                {
                    emailVerificationInstance: undefined,
                }
            );
            return EmailPassword.instance;
        };
    }

    static getInstanceOrThrow(): EmailPassword {
        if (EmailPassword.instance === undefined) {
            let error =
                "No instance of EmailPassword found. Make sure to call the EmailPassword.init method." +
                "See https://supertokens.io/docs/emailpassword/quick-setup/frontend";

            // eslint-disable-next-line supertokens-auth-react/no-direct-window-object
            if (typeof window === "undefined") {
                error = error + SSR_ERROR;
            }
            throw Error(error);
        }

        return EmailPassword.instance;
    }

    /*
     * Tests methods.
     */
    static reset(): void {
        if (!isTest()) {
            return;
        }

        EmailPassword.instance = undefined;
        return;
    }
}
