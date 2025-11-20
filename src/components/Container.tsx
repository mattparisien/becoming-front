const Container = ({ children, className = '', hasVerticalGutters = false }: { children: React.ReactNode; className?: string; hasVerticalGutters?: boolean }) => {
    return <div className={`px-4 sm:px-6 lg:px-8 ${hasVerticalGutters ? 'vertical-gutters' : ''} ${className}`}>{children}</div>;
};

export default Container;