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
/** @jsx jsx */
import { jsx } from "@emotion/react";

import { SignInThemeProps } from "../../../types";

import FormBase from "../../library/formBase";
import { withOverride } from "../../../../../components/componentOverride/withOverride";
import { validateForm } from "../../../../../utils";
import STGeneralError from "supertokens-web-js/lib/build/error";

export const SignInForm = withOverride(
    "EmailPasswordSignInForm",
    function EmailPasswordSignInForm(
        props: SignInThemeProps & {
            header?: JSX.Element;
            footer?: JSX.Element;
        }
    ): JSX.Element {
        return (
            <FormBase
                formFields={props.formFields}
                buttonLabel={"EMAIL_PASSWORD_SIGN_IN_SUBMIT_BTN"}
                onSuccess={props.onSuccess}
                // TODO NEMI: handle user context for pre built UI
                callAPI={async (formFields) => {
                    const validationErrors = await validateForm(
                        formFields,
                        props.config.signInAndUpFeature.signInForm.formFields
                    );

                    if (validationErrors.length > 0) {
                        return {
                            status: "FIELD_ERROR",
                            formFields: validationErrors,
                        };
                    }

                    const response = await props.recipeImplementation.signIn({
                        formFields,
                        config: props.recipe.webJsRecipe.config,
                        userContext: {},
                    });
                    if (response.status === "WRONG_CREDENTIALS_ERROR") {
                        throw new STGeneralError("EMAIL_PASSWORD_SIGN_IN_WRONG_CREDENTIALS_ERROR");
                    } else {
                        return response;
                    }
                }}
                validateOnBlur={false}
                showLabels={true}
                header={props.header}
                footer={props.footer}
            />
        );
    }
);
