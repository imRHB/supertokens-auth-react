import React from "react";
import Logout from "./Logout";
import SuccessView from "./SuccessView";
import { useSessionContext } from "supertokens-auth-react/recipe/session";
import { useNavigate } from "react-router-dom";
import { signOut } from "supertokens-auth-react/recipe/emailpassword";

export default function Home() {
    const sessionContext = useSessionContext();
    const navigate = useNavigate();

    async function logoutClicked() {
        await signOut();
        navigate("/auth");
    }

    if (sessionContext.loading === true) {
        // It should never come here, because this is wrapped by an Auth component without requireAuth set to false
        // Even in other cases it's safe to return null, since session loading is very fast.
        return null;
    }

    return (
        <div className="fill">
            <Logout logoutClicked={logoutClicked} />
            <SuccessView userId={sessionContext.userId} />
        </div>
    );
}
