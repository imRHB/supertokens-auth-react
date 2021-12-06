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

/** @jsx jsx */
import { getDefaultStyles, getMergedStyles } from "../../../../styles/styles";
import { NormalisedPalette, NormalisedDefaultStyles } from "../../../../types";
import { getStyles as getEmailPasswordStyles } from "../../../emailpassword/components/themes/styles/styles";

export function getStyles(palette: NormalisedPalette): NormalisedDefaultStyles {
    const baseStyles = getDefaultStyles(palette);
    const emailPasswordStyles = getEmailPasswordStyles(palette);
    const passwordlessStyles: NormalisedDefaultStyles = {
        codeInputLabelWrapper: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        },
        headerSubtitle: {
            marginTop: "10px",
            lineHeight: "21px",
        },
        resendCodeBtn: {
            width: "auto",
            marginTop: 0,
            lineHeight: "24px",
            "&:hover": {
                textDecoration: "underline",
            },
        },
        resendSuccess: {
            display: "block",
        },
        phoneInputLibRoot: {
            display: "flex",
            alignItems: "center",

            "& .PhoneInput": {
                display: "flex",
                alignItems: "center",
            },

            "& .PhoneInputInput": {
                flex: "1 1",
                minWidth: "0",
                width: "100%",
                background: "transparent",
                border: "none",
            },

            "& .PhoneInputCountryIcon": {
                width: "calc(1em * 1.5)",
                height: "1em",
            },

            "& .PhoneInputCountryIconImg": {
                display: "block",
                width: "100%",
                height: "100%",
            },

            "& .PhoneInputInternationalIconPhone": {
                opacity: "0.8",
            },

            "& .PhoneInputInternationalIconGlobe": {
                opacity: "0.65",
            },
        },
        phoneInputCountryControl: {
            "&:hover": {
                border: "none",
                boxShadow: "none",
            },
            backgroundColor: "inherit",
            border: "none",
            boxShadow: "none",
        },
        phoneInputCountryDropdown: {
            width: "320px",
            borderRadius: 6,
            marginLeft: "-15px", // This is to counteract the padding of the inputWrapper class
            boxShadow: "0px 0px 3px 0px rgba(0, 0, 0, 0.16)",
        },
        phoneInputCountryOption: {
            display: "flex",
            alignItems: "center",
            height: "34px",

            "& div": {
                margin: "0 16px",
            },
        },
        phoneInputCountryOptionSelected: {
            background: palette.colors.selectedBackground,
        },
        phoneInputCountryOptionLabel: {
            color: palette.colors.textLabel,
            // flex: "1 1",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
        },
        phoneInputCountryOptionSelectedLabel: {
            color: palette.colors.textLink,
        },
        phoneInputCountryOptionCallingCode: {
            marginLeft: "1em",
            color: palette.colors.textLabel,
            opacity: 0.5,
        },
        phoneInputCountryOptionSelectedCallingCode: {
            opacity: 1,
        },
        phoneInputCountrySelect: {
            display: "flex",
            alignItems: "center",
        },
        phoneInputCountryValueContainer: {
            padding: 0,
        },
        phoneInputCountryDropdownIndicator: {
            padding: "0 12px 0 6px",
        },
    };
    const recipeStyles = getMergedStyles(emailPasswordStyles, passwordlessStyles);
    return getMergedStyles(baseStyles, recipeStyles);
}
