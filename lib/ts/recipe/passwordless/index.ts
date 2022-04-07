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

import { UserInput } from "./types";

import Passwordless from "./recipe";
import PasswordlessAuth from "./passwordlessAuth";
import { GetRedirectionURLContext, PreAPIHookContext, OnHandleEventContext } from "./types";
import SignInUpThemeWrapper from "./components/themes/signInUp";
import { RecipeFunctionOptions, RecipeInterface } from "supertokens-web-js/recipe/passwordless";
import { PasswordlessFlowType, PasswordlessUser } from "supertokens-web-js/lib/build/recipe/passwordless/types";
import { getNormalisedUserContext } from "../../utils";
import * as UtilFunctions from "./utils";

export default class Wrapper {
    static init(config: UserInput) {
        return Passwordless.init(config);
    }

    static async signOut(): Promise<void> {
        return Passwordless.getInstanceOrThrow().signOut();
    }

    // have backwards compatibility to allow input as "signin" | "signup"
    static redirectToAuth(
        input?:
            | ("signin" | "signup")
            | {
                  show?: "signin" | "signup";
                  redirectBack?: boolean;
              }
    ): Promise<void> {
        if (input === undefined || typeof input === "string") {
            return Passwordless.getInstanceOrThrow().redirectToAuthWithoutRedirectToPath(input);
        } else {
            if (input.redirectBack === false || input.redirectBack === undefined) {
                return Passwordless.getInstanceOrThrow().redirectToAuthWithoutRedirectToPath(input.show);
            } else {
                return Passwordless.getInstanceOrThrow().redirectToAuthWithRedirectToPath(input.show);
            }
        }
    }

    static async createCode(
        input:
            | { email: string; userContext?: any; options?: RecipeFunctionOptions }
            | { phoneNumber: string; userContext?: any; options?: RecipeFunctionOptions }
    ): Promise<{
        status: "OK";
        deviceId: string;
        preAuthSessionId: string;
        flowType: PasswordlessFlowType;
        fetchResponse: Response;
    }> {
        const recipe: Passwordless = Passwordless.getInstanceOrThrow();

        return UtilFunctions.createCode({
            ...input,
            recipeImplementation: recipe.recipeImpl,
        });
    }

    static async resendCode(input: { userContext?: any; options?: RecipeFunctionOptions }): Promise<{
        status: "OK" | "RESTART_FLOW_ERROR";
        fetchResponse: Response;
    }> {
        const recipe: Passwordless = Passwordless.getInstanceOrThrow();

        return UtilFunctions.resendCode({
            ...input,
            recipeImplementation: recipe.recipeImpl,
        });
    }

    static async consumeCode(
        input:
            | {
                  userInputCode: string;
                  userContext?: any;
                  options?: RecipeFunctionOptions;
              }
            | {
                  userContext?: any;
                  options?: RecipeFunctionOptions;
              }
    ): Promise<
        | {
              status: "OK";
              createdUser: boolean;
              user: PasswordlessUser;
              fetchResponse: Response;
          }
        | {
              status: "INCORRECT_USER_INPUT_CODE_ERROR" | "EXPIRED_USER_INPUT_CODE_ERROR";
              failedCodeInputAttemptCount: number;
              maximumCodeInputAttempts: number;
              fetchResponse: Response;
          }
        | { status: "RESTART_FLOW_ERROR"; fetchResponse: Response }
    > {
        const recipe: Passwordless = Passwordless.getInstanceOrThrow();

        return UtilFunctions.consumeCode({
            ...input,
            recipeImplementation: recipe.recipeImpl,
        });
    }

    static doesEmailExist(input: { email: string; userContext?: any; options?: RecipeFunctionOptions }): Promise<{
        status: "OK";
        doesExist: boolean;
        fetchResponse: Response;
    }> {
        return Passwordless.getInstanceOrThrow().recipeImpl.doesEmailExist({
            ...input,
            userContext: getNormalisedUserContext(input.userContext),
        });
    }

    static doesPhoneNumberExist(input: {
        phoneNumber: string;
        userContext?: any;
        options?: RecipeFunctionOptions;
    }): Promise<{
        status: "OK";
        doesExist: boolean;
        fetchResponse: Response;
    }> {
        return Passwordless.getInstanceOrThrow().recipeImpl.doesPhoneNumberExist({
            ...input,
            userContext: getNormalisedUserContext(input.userContext),
        });
    }

    static PasswordlessAuth = PasswordlessAuth;

    static SignInUp = (prop?: any) => Passwordless.getInstanceOrThrow().getFeatureComponent("signInUp", prop);
    static SignInUpTheme = SignInUpThemeWrapper;

    static LinkClicked = (prop?: any) =>
        Passwordless.getInstanceOrThrow().getFeatureComponent("linkClickedScreen", prop);
}

const init = Wrapper.init;
const createCode = Wrapper.createCode;
const resendCode = Wrapper.resendCode;
const consumeCode = Wrapper.consumeCode;
const doesEmailExist = Wrapper.doesEmailExist;
const doesPhoneNumberExist = Wrapper.doesPhoneNumberExist;
const signOut = Wrapper.signOut;
const redirectToAuth = Wrapper.redirectToAuth;
const SignInUp = Wrapper.SignInUp;
const SignInUpTheme = Wrapper.SignInUpTheme;
const LinkClicked = Wrapper.LinkClicked;

export {
    PasswordlessAuth,
    SignInUp,
    SignInUpTheme,
    LinkClicked,
    init,
    createCode,
    resendCode,
    consumeCode,
    doesEmailExist,
    doesPhoneNumberExist,
    signOut,
    redirectToAuth,
    GetRedirectionURLContext,
    PreAPIHookContext,
    OnHandleEventContext,
    UserInput,
    RecipeInterface,
};
