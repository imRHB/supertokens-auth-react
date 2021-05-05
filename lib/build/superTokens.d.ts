/// <reference types="react" />
import RecipeModule from "./recipe/recipeModule";
import { ComponentWithRecipeAndMatchingMethod, NormalisedAppInfo, SuperTokensConfig } from "./types";
import NormalisedURLPath from "./normalisedURLPath";
export default class SuperTokens {
    private static instance?;
    private static reactRouterDom?;
    appInfo: NormalisedAppInfo;
    recipeList: RecipeModule<unknown, unknown, unknown>[];
    private pathsToFeatureComponentWithRecipeIdMap?;
    constructor(config: SuperTokensConfig);
    static init(config: SuperTokensConfig): void;
    static getInstanceOrThrow(): SuperTokens;
    static canHandleRoute(): boolean;
    static getRoutingComponent(): JSX.Element | undefined;
    static getSuperTokensRoutesForReactRouterDom(reactRouterDom: any): JSX.Element[];
    canHandleRoute: () => boolean;
    getRoutingComponent: () => JSX.Element | undefined;
    getPathsToFeatureComponentWithRecipeIdMap: () => Record<string, ComponentWithRecipeAndMatchingMethod[]>;
    getMatchingComponentForRouteAndRecipeId: (
        normalisedUrl: NormalisedURLPath
    ) => ComponentWithRecipeAndMatchingMethod | undefined;
    getRecipeOrThrow<T, S, R>(recipeId: string): RecipeModule<T, S, R>;
    getReactRouterDom: () =>
        | {
              Route: any;
              withRouter: any;
          }
        | undefined;
    static reset(): void;
}
