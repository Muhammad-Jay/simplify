"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {Button} from "@/components/ui/button"
import {Form} from "@/components/ui/form"
import AuthFormField from "@/components/auth/AuthFormField";
import Link from "next/link";
import {useState} from "react";
import {toast} from "sonner";
import {login, signup} from "@/lib/supabase-auth/action";
import {useRouter} from "next/navigation";


const AuthForm = ({type} : {type: 'sign-in' | 'sign-up'}) => {
    const isSign_Up = type === "sign-up"
    const [isloading, setIsloading] = useState(false)
    const router = useRouter()

    const formSchema = z.object({
        username: isSign_Up? z.string().min(2, {
            message: "Username must be at least 2 characters.",
        }): z.string().optional(),
        email: z.string().email({
            // @ts-ignore
            massage: "please enter a valid email address"
        }),
        password: z.string().min(8,{
            // @ts-ignore
            massage: "password must be at least 8 character(s) long"
        })
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: {username?: string, email: string, password: string}) {
        if(type === "sign-up") {
            try {
                setIsloading(true)
                await signup(values)
                toast.success(<p className={"text-sm p-[3px] w-[90%] center text-green-500 text-nowrap rounded-full"}>please check your inbox</p>)
            }catch (e) {
                console.log(e)
                toast("something went wrong")
            }finally {
                setIsloading(false)
            }
        }
        else if(type === "sign-in") {
            try {
                setIsloading(true)
                toast.message(
                    <p className={"text-sm p-[3px] w-[90%] center text-green-500 text-nowrap rounded-full"}>logging you in</p>
                )
                await login(values)
                router.push('/dashboard/overview')
            }catch (e) {
                // toast(<p className={"text-sm p-[3px] w-[90%] center text-red-500 text-nowrap rounded-full"}>something went wrong</p>)
            }finally {
                setIsloading(false)
            }
        }
    }

    return (
        <div
            className="relative bg-transperent max-w-[445px] h-[584px] flex flex-col items-center justify-center rounded-[10px] overflow-hidden">
            <div id="spin-animate"
                 className={` absolute  transition-all duration-75 h-[784px] w-[285px] rotate-[30deg] rounded-full bg-[linear-gradient(#00BBC2,black,black,#00BBC2)]`}
            ></div>
            {/*<BorderBeam*/}
            {/*    duration={8}*/}
            {/*    size={300}*/}
            {/*    className="from-transparent via-cyan-500 to-transparent"/>*/}
            <div
                className=" z-0 w-[99%] h-[99%] flex self-center m-auto flex-col items-center justify-center p-[20px] rounded-[10px] border-2  bg-black">
                <div className="w-full h-[30px] flex items-center justify-center mb-[50px]">
                    <h1 className="text-3xl text-white/80 font-bold">
                        {isSign_Up ? "Sign up" : "Sign in"}
                    </h1>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">

                        {isSign_Up && <AuthFormField control={form.control} name="username" label="username"
                                                     placeholder="Enter a username" type={type} inputType="text"/>}
                        <AuthFormField control={form.control} name="email" label="email" placeholder="Enter your email"
                                       type={type} required={"required"} inputType="email"/>
                        <AuthFormField control={form.control} name="password" label="password"
                                       placeholder="Enter your password" type={type} required={"required"}
                                       inputType="password"/>

                        <Button type="submit"
                                disabled={isloading} className="w-full  h-[40px] bg-[#00BBC2] hover:bg-[#00C0C7]/50 transition-all duration-500 rounded-full mt-4 text-[17px] text-white">
                            {isloading ?
                                <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="white"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z"/></svg>
                                : isSign_Up ? "create account" : "Sign in"}
                        </Button>
                    </form>
                </Form>
                <div className="w-full flex-row h-[50px] flex items-center justify-center mt-4">
                    <p className="text-sm text-white/80 font-light mr-1">
                        {isSign_Up ? "Already have an account? " : "Don't have an account? "}
                    </p>
                    <Link href={isSign_Up ? "/sign-in" : "/sign-up"}
                          className="text-sm text-blue-600">{isSign_Up ? "Sign in" : "Sign up"}</Link>
                </div>
            </div>
        </div>

    )
}
export default AuthForm

