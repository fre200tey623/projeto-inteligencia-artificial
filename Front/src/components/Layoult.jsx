import React from "react";

export default function Layout({ children }) {
    return (
        <div className="flex justify-center w-full max-w-5xl">
            {children}
        </div>
    );
}