
import MediaFrame from "../MediaFrame";
import Button from "../ui/Button";

interface HeroModuleProps {
    heading?: string;
    subHeading?: string;
}

const HeroModule = (props: HeroModuleProps) => {

    const { heading = "Transform your Squarespace site in minutes.", subHeading = "Beautiful, lightning‑fast plugins to boost your Squarespace site’s style, speed and features — no coding needed." } = props;

    return <div className="min-h-[80vh] flex flex-col items-end justify-between">
        <div className="pt-20 relative w-full uppercase flex-1">
            <p className="font-serif leading-tight text-lg md:text-xl absolute left-1/2 top-1/2 max-w-md">{subHeading}</p>
        </div>
        <div className="tracking-tighter font-sans font-light text-[10vw] tet-foreground leading-none w-full pb-5">
            <div>Squarespace</div>
            <div className="flex items-center justify-between">
                <div className="text-foreground/30">&</div>
                <div>Elevated</div>
            </div>
        </div>
    </div>
    // return <div className="flex items-center justify-between gap-20 min-h-[60vh] pb-30 pt-5">
    //     <div className="flex-1 w-1/2 flex flex-col items-start">
    //         <h1 className="text-[6vw] leading-none font-sans tracking-tight font-light text-left py-20">{heading}</h1>
    //         {/* <p>{subHeading}</p> */}
    //         <div className="pt-10">
    //             <Button size="lg" variant="outline">
    //                 Explore Plugins
    //             </Button>
    //         </div>
    //     </div>
    //     <div className="flex-1 w-1/2">
    //         <MediaFrame className="aspect-16/9">
    //             <video
    //                 src="https://f1daa0-91.myshopify.com/cdn/shop/videos/c/vp/0eb1c6a432964298b141757752e5d69a/0eb1c6a432964298b141757752e5d69a.HD-1080p-2.5Mbps-64161947.mp4"
    //                 autoPlay
    //                 loop
    //                 muted
    //                 playsInline
    //                 className="w-full h-full object-cover"

    //             />
    //         </MediaFrame>

    //     </div>
    // </div>;
}

export default HeroModule;