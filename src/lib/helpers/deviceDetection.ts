export const isMobileOrTablet = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent);
    
    return isMobile || isTablet;
};

export const isMobile = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent) && 
           !/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent);
};

export const isTablet = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const userAgent = navigator.userAgent.toLowerCase();
    return /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent);
};
