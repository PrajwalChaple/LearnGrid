import { useState, useEffect } from 'react';

// Synchronous check — runs immediately, no waiting for useEffect
function checkIsMobileDevice() {
    if (typeof window === 'undefined') return false;

    // 1. Check user agent for common mobile/tablet patterns
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);

    // 2. Check for touch capabilities (failsafe for iPads or "Desktop Mode")
    const isTouchDevice =
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0);

    // 3. Screen width check
    const isSmallScreen = window.innerWidth < 1024;

    // Mobile if it has a mobile OS OR (touch device with small screen)
    // This prevents touch-enabled Windows laptops from being falsely flagged
    return isMobileUA || (isTouchDevice && isSmallScreen);
}

export function useIsMobileDevice() {
    // Initialize with synchronous check — correct from FIRST RENDER
    // This prevents AiBuddy from briefly trying to load Spline on mobile
    const [isMobile, setIsMobile] = useState(() => checkIsMobileDevice());

    useEffect(() => {
        // Re-check on resize (orientation change)
        const handleResize = () => setIsMobile(checkIsMobileDevice());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
}
