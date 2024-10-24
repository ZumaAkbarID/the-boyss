import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import { CarauselHome } from "@/Components/elements/CarauselHome";
import CardHome from "@/Components/elements/CardHome";
import HistorySmWidth from "@/Components/elements/HistorySmWidth";
import DriverGalonForm from "./Dashboard/galon/Create";
import SquareHome from "@/Components/elements/SquareHome";
import ShowUsers from "./Dashboard/user/Show";
import React, { useEffect } from "react";
import SubModal from "@/Components/elements/SubModal";
import UserGalonUpdateForm from "./Dashboard/userGalon/Update";

type DashboardProps = {
    auth: any;
    kas: any;
    peopleRemaining: any;
    users: any;
    galonDrivers: any;
    talangan: any;
    saldoCounts: any;
    talanganCounts: any;
};

type GalonDriver = {
    id: number;
    name: string;
    number: string;
    status: boolean;
    updated_at: string;
    created_at: string;
};

export default function Dashboard({
    auth,
    kas,
    peopleRemaining,
    users,
    galonDrivers,
    talangan,
    saldoCounts,
    talanganCounts,
}: PageProps<DashboardProps>) {
    const { ledgers, currentSaldo }: any = usePage().props;

    const lastLegers = ledgers.slice(0, 5);
    const userGalon = users.filter((user: any) => user.galon === 1);
    const [isUserGalon, setIsUserGalon] = React.useState<boolean>(false);
    const [galonDriverSelected, setGalonDriverSelected] =
        React.useState<GalonDriver>();

    useEffect(() => {
        setGalonDriverSelected(
            galonDrivers.find((driver: any) => driver.status === 1)
        );
    }, [galonDrivers]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-pretty">Home</h2>}
        >
            <Head title="Home" />

            <div className="px-2 grid gap-2 pb-24">
                <h1 className="text-sm">
                    Selamat datang,{" "}
                    <span className="font-semibold">"{auth.user.name}"</span>
                </h1>

                {/* OVERVIEW */}
                <div>
                    <h1 className="text-xl font-bold">Overview</h1>
                    <CarauselHome
                        kas={kas}
                        peopleRemaining={peopleRemaining}
                        currentSaldo={currentSaldo}
                        talangan={talangan}
                        saldoCounts={saldoCounts}
                        talanganCounts={talanganCounts}
                    />
                </div>
                {/* END OVERVIEW */}

                {/* SHORTCUT */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    <SquareHome
                        text={`${
                            userGalon.length > 0 ? userGalon[0].name : "----"
                        }`}
                        icon="bx-droplet"
                        color="bg-[#5CA4C5] dark:bg-[#76ABAE]"
                        text_color="dark:text-[#EEEEEE] text-white"
                        className="dark:text-[#EEEEEE] text-white dark:border-[#EEEEEE]"
                        onclickEvent={() => setIsUserGalon(!isUserGalon)}
                    />

                    <SquareHome
                        text="Pesan Galon"
                        icon="bxs-phone-call"
                        color=" dark:bg-gray-800"
                        text_color="dark:text-gray-300"
                        className="dark:text-gray-300  dark:border-gray-500"
                        onclickEvent={() => {
                            const phoneNumber = galonDriverSelected?.number;
                            const message = encodeURIComponent(
                                "Pesan Galon 2 alamat Jalan Gurame IV no 5, terimakasih"
                            );
                            const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;
                            window.open(waUrl, "_blank");
                        }}
                    />

                    <SquareHome
                        text="Member"
                        icon="bx-group"
                        color="bg-[#5CA4C5] dark:bg-[#76ABAE]"
                        text_color="dark:text-[#EEEEEE] text-white"
                        className="dark:text-[#EEEEEE] text-white dark:border-[#EEEEEE]"
                        onclickEvent={() => (window.location.href = "#member")}
                    />

                    {auth.user.galon === 1 && (
                        <UserGalonUpdateForm user={userGalon} />
                    )}
                </div>
                {/* END GALON */}

                {/* INFORMASI */}
                <div className="grid gap-2">
                    <h1 className=" text-xl font-bold">Informasi</h1>

                    <span className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <CardHome title="The Boys" />

                        <DriverGalonForm galonDrivers={galonDrivers} />

                        <ShowUsers galonDrivers={galonDrivers} users={users} />
                    </span>
                </div>
                {/* END INFORMASI */}

                {/* HISTORY */}
                <div className="grid gap-2">
                    <span className="flex w-full items-center justify-between py-1">
                        <h1 className="text-xl font-bold">
                            Transaksi Terakhir
                        </h1>

                        {lastLegers.length !== 0 && (
                            <Link
                                href={route("history.index")}
                                className="flex items-center gap-2 text-[#5CA4C5] bg-gray-200 px-2 h-full rounded-md dark:bg-[#76ABAE] dark:text-[#EEEEEE]"
                            >
                                <i className="bx bx-dots-horizontal-rounded text-xl"></i>
                            </Link>
                        )}
                    </span>

                    {lastLegers.length === 0 ? (
                        <div className="flex items-center justify-center h-20 rounded-lg shadow-md border dark:border-gray-700">
                            tidak ada data
                        </div>
                    ) : (
                        <HistorySmWidth items={lastLegers} />
                    )}
                </div>
                {/* END HISTORY */}

                {isUserGalon && (
                    <SubModal
                        isOpen={isUserGalon}
                        setIsOpen={setIsUserGalon}
                        title="Urutan Pesan Galon"
                        description="Yang punya backgroud berbeda adalah yang punya giliran!"
                        content={
                            <span className="flex flex-wrap gap-2 items-center justify-center">
                                {users.map((user: any) => (
                                    <div key={user.id}>
                                        <button
                                            className={`py-1 px-3 ${
                                                user.galon === 1
                                                    ? "text-gray-200 bg-[#368CB6]"
                                                    : "border border-[#368CB6] text-[#368CB6]"
                                            } rounded-md`}
                                        >
                                            <small className="font-bold">
                                                {user.name}
                                            </small>
                                        </button>
                                    </div>
                                ))}
                            </span>
                        }
                    />
                )}
            </div>
        </AuthenticatedLayout>
    );
}
