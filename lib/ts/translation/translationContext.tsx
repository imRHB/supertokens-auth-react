import React, { PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import {
    getCurrentLanguageFromCookie,
    TranslationContextType,
    TranslationControlEventSource,
    TranslationEventHandler,
    TranslationFunc,
    TranslationStore,
} from "./translationHelpers";
import { mergeObjects } from "../utils";
import assert from "assert";

const errCB = () => {
    throw new Error("Cannot use translation func outside TranslationContext provider.");
};
export const TranslationContext = React.createContext<TranslationContextType>({
    translate: errCB,
});

export const useTranslation = (): TranslationFunc => {
    return useContext(TranslationContext).translate;
};

export const TranslationContextProvider: React.FC<
    PropsWithChildren<{
        defaultLanguage: string;
        defaultStore: TranslationStore;
        userTranslationFunc?: TranslationFunc;
        translationControlEventSource: TranslationControlEventSource;
    }>
> = ({ children, defaultLanguage, userTranslationFunc, defaultStore, translationControlEventSource }) => {
    const [translationStore, setTranslationStore] = useState<TranslationStore>(defaultStore);
    const [currentLanguage, setCurrentLanguage] = useState<string | undefined>(undefined);

    const loadLanguageFromCookies = useCallback(
        async function () {
            let cookieLang = await getCurrentLanguageFromCookie();
            cookieLang = cookieLang === null ? defaultLanguage : cookieLang;

            setCurrentLanguage(cookieLang);
        },
        [defaultLanguage]
    );

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const changeHandler: TranslationEventHandler<"LanguageChange"> = (_eventName, detail) => {
            setCurrentLanguage(detail);
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const loadHandler: TranslationEventHandler<"TranslationLoaded"> = (_eventName, detail) => {
            setTranslationStore((os) => mergeObjects(os, detail));
        };

        translationControlEventSource.on("LanguageChange", changeHandler);
        translationControlEventSource.on("TranslationLoaded", loadHandler);

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        loadLanguageFromCookies();

        return () => {
            translationControlEventSource.off("LanguageChange", changeHandler);
            translationControlEventSource.off("TranslationLoaded", loadHandler);
        };
    });

    const translateFunc = useCallback<TranslationFunc>(
        (key: string) => {
            if (userTranslationFunc !== undefined) {
                return userTranslationFunc(key);
            }

            assert(currentLanguage !== undefined);

            const res = translationStore[currentLanguage!] && translationStore[currentLanguage!][key];
            const fallback = translationStore[defaultLanguage] && translationStore[defaultLanguage][key];

            if (res === undefined) {
                if (fallback !== undefined) {
                    return fallback;
                }
                return key;
            }

            return res;
        },
        [translationStore, currentLanguage, defaultLanguage, userTranslationFunc]
    );

    if (currentLanguage === undefined) {
        return <></>;
    }

    return <TranslationContext.Provider value={{ translate: translateFunc }}>{children}</TranslationContext.Provider>;
};
