import { OnHandleEventContext, PreAndPostAPIHookAction, StateObject } from "./types";
import { User } from "../authRecipeWithEmailVerification/types";
import { getRedirectToPathFromURL } from "../../utils";
import { RecipeInterface } from "supertokens-web-js/recipe/thirdparty";
import WebJSRecipeImplementation from "supertokens-web-js/lib/build/recipe/thirdparty/recipeImplementation";
import { NormalisedAppInfo } from "../../types";
import {
    RecipeOnHandleEventFunction,
    RecipePostAPIHookFunction,
    RecipePreAPIHookFunction,
} from "../recipeModule/types";

export default function getRecipeImplementation(recipeInput: {
    recipeId: string;
    appInfo: NormalisedAppInfo;
    preAPIHook: RecipePreAPIHookFunction<PreAndPostAPIHookAction>;
    postAPIHook: RecipePostAPIHookFunction<PreAndPostAPIHookAction>;
    onHandleEvent: RecipeOnHandleEventFunction<OnHandleEventContext>;
}): RecipeInterface {
    const webJsImplementation = WebJSRecipeImplementation(
        recipeInput.recipeId,
        recipeInput.appInfo,
        recipeInput.preAPIHook,
        recipeInput.postAPIHook
    );

    return {
        getAuthorisationURLFromBackend: async function (input): Promise<{
            status: "OK";
            url: string;
            fetchResponse: Response;
        }> {
            const response = await webJsImplementation.getAuthorisationURLFromBackend.bind(this)({
                providerId: input.providerId,
                userContext: input.userContext,
            });

            return response;
        },

        signInAndUp: async function (input): Promise<
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
        > {
            const response = await webJsImplementation.signInAndUp.bind(this)({
                userContext: input.userContext,
            });

            if (response.status === "OK") {
                recipeInput.onHandleEvent({
                    action: "SUCCESS",
                    isNewUser: response.createdNewUser,
                    user: response.user,
                });
            }

            return response;
        },
        getStateAndOtherInfoFromStorage: function <CustomStateProperties>(input: {
            userContext: any;
        }): (StateObject & CustomStateProperties) | undefined {
            return webJsImplementation.getStateAndOtherInfoFromStorage.bind(this)<CustomStateProperties>({
                userContext: input.userContext,
            });
        },

        setStateAndOtherInfoToStorage: function (input): void {
            return webJsImplementation.setStateAndOtherInfoToStorage.bind(this)<{
                rid?: string;
                redirectToPath?: string;
            }>({
                state: {
                    ...input.state,
                    rid: recipeInput.recipeId,
                    redirectToPath: getRedirectToPathFromURL(),
                },
                userContext: input.userContext,
            });
        },

        getAuthorizationURLWithQueryParamsAndSetState: async function (input) {
            return webJsImplementation.getAuthorizationURLWithQueryParamsAndSetState.bind(this)({
                ...input,
            });
        },

        getAuthStateFromURL: function (input): string {
            return webJsImplementation.getAuthStateFromURL.bind(this)(input);
        },

        generateStateToSendToOAuthProvider: function (input) {
            return webJsImplementation.generateStateToSendToOAuthProvider.bind(this)({
                ...input,
            });
        },
        verifyAndGetStateOrThrowError: function (input) {
            return webJsImplementation.verifyAndGetStateOrThrowError.bind(this)({
                stateFromAuthProvider: input.stateFromAuthProvider,
                stateObjectFromStorage: input.stateObjectFromStorage,
                userContext: input.userContext,
            });
        },

        getAuthCodeFromURL: function (input): string {
            return webJsImplementation.getAuthCodeFromURL.bind(this)({
                userContext: input.userContext,
            });
        },

        getAuthErrorFromURL: function (input): string | undefined {
            return webJsImplementation.getAuthErrorFromURL.bind(this)({
                userContext: input.userContext,
            });
        },
    };
}
