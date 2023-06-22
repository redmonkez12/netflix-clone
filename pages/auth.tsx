import { useState, useCallback } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";

import { Input } from "@/components/Input";
import { useRouter } from "next/router";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FaG } from "react-icons/fa6";
import { sign } from "crypto";

const Auth = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const [variant, setVariant] = useState("login");

    const toggleVariant = useCallback(() => {
        setVariant(currentVariant => currentVariant === "login" ? "register" : "login");
    }, []);

    const register = useCallback(async () => {
        try {
            await axios.post("/api/register", {
                email,
                name,
                password,
            });

            await router.push("/");
        } catch (e) {
            console.log(e);
        }
    }, [email, name, password]);

    const login = useCallback(async () => {
        try {
            await signIn("credentials", {
                email,
                password,
                redirect: false,
                callbackUrl: "/"
            });

            await router.push("/");
        } catch (e) {
            console.log(e);
        }
    }, [email, password, router]);

    return (
        <div className="
        relative
        h-full
        w-full
        bg-[url('/images/hero.jpg')]
        bg-no-repeat
        bg-center
        bg-fixed
        bg-cover
        ">
            <div className="bg-black w-full h-full lg:bg-opacity-50">
                <nav className="px-12 py-5">
                    <img src="/images/logo.png" alt="Logo" className={"h-12"}/>
                </nav>
                <div className="flex justify-center">
                    <div className="bg-black bg-opacity-70 px-16 py-16 self-center mt-2 lg:w-2/5 lg:max-w-md w-full">
                        <h2 className={"text-white text-4xl mb-8 font-semibold"}>{variant === "login" ? "Sign in" : "Create an account"}</h2>

                        <div className="flex flex-col gap-4">
                            <Input
                                label={"Email"}
                                onChange={(event) => setEmail(event.target.value)}
                                type={"email"}
                                id={"email"}
                                value={email}/>

                            {variant === "register" && (
                                <Input
                                    label={"Name"}
                                    onChange={(event) => setName(event.target.value)}
                                    type={"text"}
                                    id={"name"}
                                    value={name}/>
                            )}

                            <Input
                                label={"Password"}
                                onChange={(event) => setPassword(event.target.value)}
                                type={"password"}
                                id={"password"}
                                value={password}/>

                            <button
                                onClick={variant === "login" ? login : register}
                                className="bg-red-600 py-3 text-white rounded-md mt-10 hover:bg-red-700 transition">
                                {variant === "login" ? "Login" : "Sign up"}
                            </button>

                            <div className="flex flex-row-items-center gap-4 mt-8 justify-center">
                                <div
                                    onClick={() => signIn("google", { callbackUrl: "/" })}
                                    className="
                                    w-10
                                    h-10
                                    bg-white
                                    rounded-full
                                    flex
                                    items-center
                                    justify-center
                                    cursor-pointer
                                    hover:opacity-80
                                    transition
                                ">
                                    <FcGoogle size={30}/>
                                </div>

                                <div
                                    onClick={() => signIn("github", { callbackUrl: "/" })}
                                    className="
                                    w-10
                                    h-10
                                    bg-white
                                    rounded-full
                                    flex
                                    items-center
                                    justify-center
                                    cursor-pointer
                                    hover:opacity-80
                                    transition
                                ">
                                    <FaGithub size={30}/>
                                </div>
                            </div>

                            <p className="text-neutral-500 mt-12">
                                {variant === "login " ? "First time using Netflix?" : "Already have an account?"}
                                <span className={"text-white ml-1 hover:underline cursor-pointer"}
                                      onClick={toggleVariant}>
                                    {variant === "login" ? "Create an account" : "Login"}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;