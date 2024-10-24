import * as React from "react";

import { Card, CardContent } from "@/Components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
} from "@/Components/ui/carousel";
import { formatAmount, months } from "@/formater";
import { usePage } from "@inertiajs/react";
import SubModal from "./SubModal";

type CarauselProps = {
    kas: number;
    peopleRemaining: number;
    currentSaldo: number;
    talangan: any;
    saldoCounts: any;
    talanganCounts: any;
};

export function CarauselHome({
    kas,
    peopleRemaining,
    currentSaldo,
    talangan,
    saldoCounts,
    talanganCounts,
}: CarauselProps): JSX.Element {
    const { defaultKas, talangans }: any = usePage().props;
    const [saldoDetail, setSaldoDetail] = React.useState<boolean>(false);
    const [talanganDetail, setTalanganDetail] = React.useState<boolean>(false);

    const talanganFiltered = talangans.filter((talangan: any) => {
        return talangan.dikembalikan == 0;
    });

    const CarauselCards = [
        {
            icon: "bx-dollar",
            title: "Saldo",
            saldo: `${formatAmount(currentSaldo)}`,
            describe: `${
                currentSaldo == 0
                    ? "🥵 Saldo Abis bang"
                    : currentSaldo === 0.5 * kas
                    ? "🫣 Saldo tinggal setegah"
                    : currentSaldo < 0.5 * kas && currentSaldo == 1
                    ? "Saldo dikit lagi abis"
                    : currentSaldo < 0
                    ? "🤑 Saldo minus bang"
                    : "🤫🙂‍↔️ Masi kaya broh.."
            }`,
            onclick: () => setSaldoDetail(!saldoDetail),
        },
        {
            icon: "bxs-wallet",
            title: "Kas",
            saldo: `${formatAmount(kas)}`,
            describe: `${
                peopleRemaining == 0
                    ? "semua sudah bayar kas"
                    : `${peopleRemaining} orang belum bayar kas`
            }`,
            kas: `${defaultKas ? formatAmount(defaultKas.default_kas) : ""}`,
        },
        {
            icon: "bxl-slack",
            title: "Talangan",
            saldo: `${formatAmount(talangan)}`,
            describe: `${
                talanganFiltered.length > 0
                    ? `${talanganFiltered.length} Talangan belm di kembalikan`
                    : "Semua talangan sudah di kembalikan"
            }`,
            onclick: () => setTalanganDetail(!talanganDetail),
        },
    ];

    return (
        <>
            <Carousel
                opts={{
                    align: "start",
                }}
                orientation="horizontal"
                className="w-full max-w-xs md:max-w-6xl"
            >
                <CarouselContent className="p-1">
                    {CarauselCards.map((card, index) => (
                        <CarouselItem key={index} className="pt-1 md:basis-1/4">
                            <div className="p-1">
                                <Card
                                    onClick={card.onclick}
                                    className={`cursor-pointer ${
                                        index % 2 !== 0
                                            ? "bg-[#5CA4C5] text-white dark:bg-[#76ABAE] dark:text-[#EEEEEE] "
                                            : "dark:bg-gray-800 dark:text-gray-200"
                                    } `}
                                >
                                    <CardContent className="flex items-start justify-center flex-col py-5 gap-5">
                                        <div className="flex items-center justify-between w-full">
                                            <span
                                                className={`flex items-center gap-2 font-bold ${
                                                    index % 2 !== 0
                                                        ? "text-gray-200 "
                                                        : "text-gray-500 dark:text-gray-400"
                                                }`}
                                            >
                                                <div
                                                    className={`boder ${
                                                        index % 2 !== 0
                                                            ? "bg-[#368CB6] dark:bg-[#557a7c]"
                                                            : "bg-[#E5E6EC] dark:bg-gray-900"
                                                    } py-1 px-2 rounded-xl`}
                                                >
                                                    <i
                                                        className={`bx ${card.icon} text-xl`}
                                                    />
                                                </div>
                                                <h1 className="text-2xl ">
                                                    {card.title}
                                                </h1>
                                                {card.kas && (
                                                    <small className="text-green-300 pt-2">
                                                        {card.kas}
                                                    </small>
                                                )}
                                            </span>
                                            <small
                                                className={` ${
                                                    index % 2 !== 0
                                                        ? "text-gray-200"
                                                        : "text-gray-500 dark:text-gray-400"
                                                }`}
                                            >
                                                {months[new Date().getMonth()]}
                                            </small>
                                        </div>
                                        <p className="text-2xl font-bold w-full text-center">
                                            {card.saldo};
                                        </p>
                                        <p
                                            className={`w-full text-center text-sm py-1  rounded-lg`}
                                        >
                                            {card.describe}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselNext className="md:hidden" />
            </Carousel>

            {saldoDetail && (
                <SubModal
                    isOpen={saldoDetail}
                    setIsOpen={setSaldoDetail}
                    title="Detail Saldo"
                    description="Hanya akumulasi saldo sisa yang ada setiap bulanya"
                    content={
                        <span className="grid grid-cols-2 gap-2">
                            {saldoCounts.map((saldo: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex gap-2 py-1.5 border text-white rounded-md items-center justify-center"
                                >
                                    <small className="flex gap-4">
                                        {months[saldo.month - 1]}
                                        <span className="font-bold">
                                            {formatAmount(saldo.saldo_sisa)}
                                        </span>
                                    </small>
                                </div>
                            ))}
                        </span>
                    }
                />
            )}

            {talanganDetail && (
                <SubModal
                    isOpen={talanganDetail}
                    setIsOpen={setTalanganDetail}
                    title="Detail Talangan"
                    description="Rekap talangan yang belum di kembalikan."
                    content={
                        <span className="flex flex-col items-center justify-center gap-2">
                            {talanganCounts.map(
                                (talangan: any, index: number) => (
                                    <div
                                        key={index}
                                        className="px-5 flex gap-2 py-1 border text-white rounded-md items-center justify-center"
                                    >
                                        <small>{talangan.tujuan}</small>-
                                        <small className="font-semibold flex items-center justify-center">
                                            {formatAmount(talangan.amount)} (
                                            <small>{talangan.user.name}</small>)
                                        </small>
                                    </div>
                                )
                            )}
                        </span>
                    }
                />
            )}
        </>
    );
}
