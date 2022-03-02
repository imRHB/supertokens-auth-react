/// <reference types="react" />
import EmailVerificationTheme from "../emailverification/components/themes/emailVerification";
import { UserInput, GetRedirectionURLContext, PreAPIHookContext, OnHandleEventContext } from "./types";
import ThirdPartyAuth from "./thirdpartyAuth";
import SignInAndUpTheme from "./components/themes/signInAndUp";
import Apple from "./providers/apple";
import Google from "./providers/google";
import Facebook from "./providers/facebook";
import Github from "./providers/github";
import { User } from "../authRecipeWithEmailVerification/types";
import { RecipeInterface } from "supertokens-web-js/recipe/thirdparty";
export default class Wrapper {
    static init(
        config: UserInput
    ): import("../../types").CreateRecipeFunction<
        import("../authRecipeWithEmailVerification/types").GetRedirectionURLContext,
        import("./types").PreAndPostAPIHookContext,
        OnHandleEventContext,
        import("./types").NormalisedConfig
    >;
    static signOut(): Promise<void>;
    static isEmailVerified(input?: { userContext?: any }): Promise<{
        status: "OK";
        isVerified: boolean;
        fetchResponse: Response;
    }>;
    static verifyEmail(input: { userContext?: any }): Promise<{
        status: "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR" | "OK";
        fetchResponse: Response;
    }>;
    static sendVerificationEmail(input?: { userContext?: any }): Promise<{
        status: "EMAIL_ALREADY_VERIFIED_ERROR" | "OK";
        fetchResponse: Response;
    }>;
    static redirectToAuth(
        input?:
            | ("signin" | "signup")
            | {
                  show?: "signin" | "signup";
                  redirectBack?: boolean;
              }
    ): Promise<void>;
    static getAuthorizationURLWithQueryParamsAndSetState(input: {
        providerId: string;
        authorisationURL: string;
        userContext: any;
        providerClientId?: string;
    }): Promise<string>;
    static signInAndUp(input?: { userContext?: any }): Promise<
        | {
              status: "OK";
              user: User;
              createdNewUser: boolean;
              fetchResponse: Response;
          }
        | {
              status: "NO_EMAIL_GIVEN_BY_PROVIDER";
              fetchResponse: Response;
          }
    >;
    static Google: typeof Google;
    static Apple: typeof Apple;
    static Facebook: typeof Facebook;
    static Github: typeof Github;
    static ThirdPartyAuth: typeof ThirdPartyAuth;
    static SignInAndUp: (prop?: any) => JSX.Element;
    static SignInAndUpTheme: typeof SignInAndUpTheme;
    static EmailVerification: (prop?: any) => JSX.Element;
    static EmailVerificationTheme: typeof EmailVerificationTheme;
}
declare const init: typeof Wrapper.init;
declare const signOut: typeof Wrapper.signOut;
declare const isEmailVerified: typeof Wrapper.isEmailVerified;
declare const verifyEmail: typeof Wrapper.verifyEmail;
declare const sendVerificationEmail: typeof Wrapper.sendVerificationEmail;
declare const getAuthorizationURLWithQueryParamsAndSetState: typeof Wrapper.getAuthorizationURLWithQueryParamsAndSetState;
declare const signInAndUp: typeof Wrapper.signInAndUp;
declare const redirectToAuth: typeof Wrapper.redirectToAuth;
declare const SignInAndUp: (prop?: any) => JSX.Element;
declare const EmailVerification: (prop?: any) => JSX.Element;
export {
    ThirdPartyAuth,
    init,
    Apple,
    Google,
    Facebook,
    Github,
    isEmailVerified,
    verifyEmail,
    sendVerificationEmail,
    signInAndUp,
    getAuthorizationURLWithQueryParamsAndSetState,
    SignInAndUp,
    SignInAndUpTheme,
    signOut,
    redirectToAuth,
    EmailVerification,
    EmailVerificationTheme,
    User,
    GetRedirectionURLContext,
    PreAPIHookContext,
    OnHandleEventContext,
    UserInput,
    RecipeInterface,
};
