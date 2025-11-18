import classNames from "classnames";

interface LogoProps {
    text: string;
    className?: string;
    id?: string;
}

const Logo = ({ className, text, id }: LogoProps) => {
    return <div className={classNames(`font-logo`, {
        [className as string]: className
    })}
        id={id}>
        {text}
    </div >
}

export default Logo;