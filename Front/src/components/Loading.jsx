import React from "react";
import { ImSpinner8 } from "react-icons/im";

export default function Loading() {
    return (
        <div className="flex flex-col gap-4 justify-center items-center pt-4 md:pt-20">
            <label className="text-lg">Quase lá...estou realizando a busca pelos sites...</label>
            <ImSpinner8 className="animate-spin text-4xl" />
        </div>
    );
}