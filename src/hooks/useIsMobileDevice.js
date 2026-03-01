import { useState, useEffect } from 'react';

export function useIsMobileDevice() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIsMobile = () => {
            // 1. Check user agent for common mobile/tablet patterns
            const userAgent = navigator.userAgent || navigator.vendor || window.opera;
            const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);

            // 2. Check for touch capabilities (failsafe for iPads or "Desktop Mode" request)
            // Macs have 0 maxTouchPoints, iPads/phones have > 0
            const isTouchDevice =
                ('ontouchstart' in window) ||
                (navigator.maxTouchPoints > 0) ||
                (navigator.msMaxTouchPoints > 0);

            // 3. Optional: Screen width check (if mobile user-agent but surprisingly large screen, 
            //    it's still likely a mobile device in landscape or tablet, so touch/UA takes precedence)
            const isSmallScreen = window.innerWidth < 1024;

            // If it has a mobile OS OR it's a touch device with a small screen
            // (This prevents touch-enabled Windows laptops from being falsely marked as "mobile")
            return isMobileUA || (isTouchDevice && isSmallScreen);
        };

        // Initial check
        setIsMobile(checkIsMobile());

        // Re-check on resize (in case of orientation change)
        const handleResize = () => setIsMobile(checkIsMobile());
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return isMobile;
}
