import React from "react";

export default function Layout({ children }) {
    return (
        <div className="flex justify-center w-full max-w-4xl ">
            {children}
        </div>
    );
}