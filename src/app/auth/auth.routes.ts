import { Route } from "@angular/router";
import { Signup } from "./signup/signup";
import { Signin } from "./signin/signin";

export const routes: Route[] = [
    {
        path: 'signup',
        component: Signup
    },
    {
        path: 'signin',
        component: Signin
    }
]