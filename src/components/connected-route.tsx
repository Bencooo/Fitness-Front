import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {IUserId} from "../models/user.model";
import {AuthService} from "../services/auth.service";
import {ServiceErrorCode} from "../services/service.result";

export interface ConnectedRouteAttributes {
    access?: number;
}

function ConnectedRoute(attributes: ConnectedRouteAttributes) {

    const token = localStorage.getItem("token");
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<IUserId>();

    useEffect(() => {
        const fetchUser = async () => {
            if(!token) {
                setIsLoading(false);
                return;
            }
            const res = await AuthService.me(token);
            if(res.errorCode === ServiceErrorCode.success && res.result) {
                setUser(res.result);
            } else {
                setUser(undefined);
            }
            setIsLoading(false);
        };
        fetchUser();
    }, [token]);

    if(isLoading) {
        return (
            <div>Checking access...</div>
        );
    }

    if(!user || (attributes.access!=100)) {
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
    }

    /*if(!user || (attributes.access && user.accesses.indexOf(attributes.access) == -1)) {
        localStorage.removeItem('token');
        return <Navigate to="/login" />;
    }*/

    return <Outlet />
}

export default ConnectedRoute;