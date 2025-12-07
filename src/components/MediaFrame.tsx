import classNames from "classnames";

interface MediaFrameProps {
    children: React.ReactNode;
    className?: string;
}

const MediaFrame = (props: MediaFrameProps) => {
    return <div className={classNames("overflow-hidden rounded-2xl", props.className)}>{props.children}</div>
}

export default MediaFrame;