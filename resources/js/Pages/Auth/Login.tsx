import React, { FormEventHandler, useEffect, useState } from "react";
import { Checkbox } from "@/Components/ui/checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/Label";
import { Input } from "@/Components/ui/input";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [isRemember, setIsRemember] = React.useState<boolean>(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        setData("remember", isRemember);
    }, [isRemember]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="py-10 ">
                <span className="grid gap-5">
                    <div className="grid w-full  items-center gap-1.5">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            type="text"
                            name="username"
                            value={data.username}
                            autoComplete="username"
                            leftAddon={<i className="bx bx-user"></i>}
                            onChange={(e) =>
                                setData("username", e.target.value)
                            }
                            placeholder="Masukan username"
                        />
                        <InputError
                            message={errors.username}
                            className="mt-2"
                        />
                    </div>
                    <div className="grid w-full  items-center gap-1.5">
                        <Label htmlFor="password">Sandi</Label>
                        <Input
                            type="password"
                            name="password"
                            leftAddon={<i className="bx bx-key"></i>}
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="Masukan sandi"
                        />
                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>
                </span>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2 z-40">
                        <Checkbox
                            id="remember"
                            name="remember"
                            onClick={() => setIsRemember(!isRemember)}
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Ingat saya
                        </label>
                    </div>
                    {/* {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="underline text-sm text-blue-400 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Lupa password?
                        </Link>
                    )} */}
                </div>

                <Button
                    disabled={processing}
                    className="mt-5 w-full"
                    variant={"primary"}
                >
                    Masuk
                </Button>
            </form>
        </GuestLayout>
    );
}
