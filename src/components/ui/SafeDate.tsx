"use client";

import React, { useEffect, useState } from "react";

interface SafeDateProps {
    date: Date | string;
    className?: string;
}

/**
 * A component that renders a localized date string only on the client
 * to prevent hydration mismatches caused by server/client timezone or locale differences.
 */
export default function SafeDate({ date, className }: SafeDateProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const dateObj = typeof date === "string" ? new Date(date) : date;
    
    if (!mounted) {
        // Return a stable placeholder during SSR
        return <span className={className}>...</span>;
    }

    return <span className={className}>{dateObj.toLocaleDateString()}</span>;
}
