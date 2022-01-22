/// <reference types="react" />
import { UserInput } from "./types";
import EmailVerificationTheme from "./components/themes/emailVerification";
import { GetRedirectionURLContext, PreAPIHookContext, OnHandleEventContext, RecipeInterface } from "./types";
import { BooleanGrant } from "../session/types";
export default class Wrapper {
    static emailVerifiedGrant: BooleanGrant;
    static EmailVerification: (prop?: any) => JSX.Element;
    static EmailVerificationTheme: typeof EmailVerificationTheme;
    static init(
        config: UserInput
    ): import("../../types").CreateRecipeFunction<
        GetRedirectionURLContext,
        PreAPIHookContext,
        OnHandleEventContext,
        import("./types").NormalisedConfig
    >;
    static isEmailVerified(): Promise<boolean>;
}
declare const init: typeof Wrapper.init;
declare const isEmailVerified: typeof Wrapper.isEmailVerified;
declare const EmailVerification: (prop?: any) => JSX.Element;
export declare const emailVerifiedGrant: BooleanGrant;
export {
    init,
    isEmailVerified,
    EmailVerification,
    EmailVerificationTheme,
    GetRedirectionURLContext,
    PreAPIHookContext,
    OnHandleEventContext,
    UserInput,
    RecipeInterface,
};
