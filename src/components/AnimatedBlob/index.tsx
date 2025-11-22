
import { useRef, useEffect } from "react";
import gsap from "gsap";
import MorphSVGPlugin from "gsap/MorphSVGPlugin";

interface AnimatedBlobProps {
    color?: string;
}

const AnimatedBlob = ({color}: AnimatedBlobProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const svgPathRef = useRef<SVGPathElement>(null);

    // Array o   SVG path strings (for future animation)
    const blobPaths = [
        "M58.2,-32.5C71.7,-10.1,76.5,18.4,65.4,37.6C54.2,56.7,27.1,66.5,2.3,65.1C-22.5,63.8,-45,51.4,-56.3,32.1C-67.6,12.9,-67.7,-13.1,-56.5,-34.2C-45.2,-55.2,-22.6,-71.2,-0.2,-71.1C22.3,-71,44.6,-54.8,58.2,-32.5Z",
        "M71.3,-37.6C85.4,-16.8,85,16,70.7,40.9C56.4,65.8,28.2,82.7,0,82.7C-28.2,82.7,-56.4,65.8,-69.8,41.4C-83.3,17,-82,-14.8,-67.9,-35.6C-53.8,-56.5,-26.9,-66.3,0.9,-66.8C28.6,-67.3,57.2,-58.4,71.3,-37.6Z",
        "M67.4,-39.4C79,-19,74,10.5,60,34.4C46.1,58.4,23,76.9,-1.9,78C-26.9,79.1,-53.7,62.8,-66.5,39.5C-79.2,16.3,-77.9,-13.9,-64.4,-35.4C-51,-56.9,-25.5,-69.7,1.2,-70.4C28,-71.1,55.9,-59.8,67.4,-39.4Z",
        "M66,-35.8C79.3,-15,79.7,15.6,66.5,37.1C53.4,58.6,26.7,70.9,0.4,70.7C-25.9,70.4,-51.8,57.6,-63.7,36.9C-75.6,16.1,-73.5,-12.5,-60.6,-33.1C-47.6,-53.7,-23.8,-66.1,1.2,-66.9C26.3,-67.6,52.6,-56.6,66,-35.8Z",

        "M59.5,-57.8C75.7,-43.3,86.4,-21.7,84.9,-1.6C83.3,18.5,69.4,37,53.2,49.8C37,62.6,18.5,69.6,-1.7,71.3C-21.9,73,-43.9,69.4,-58.5,56.6C-73.2,43.9,-80.6,21.9,-79.2,1.4C-77.9,-19.2,-67.8,-38.5,-53.1,-52.9C-38.5,-67.4,-19.2,-77.1,1.2,-78.3C21.7,-79.5,43.3,-72.2,59.5,-57.8Z"
    ];

    useEffect(() => {
        gsap.registerPlugin(MorphSVGPlugin);
        const svg = svgRef.current;
        const path = svgPathRef.current;
        if (!svg || !path) return;

        const blobTl = (): GSAPTimeline => {
            const tl = gsap.timeline({ repeat: -1, yoyo: true, ease: "linear" });
            blobPaths.forEach((blobPath, index) => {
                tl.to(path, {
                    duration: 2,
                    morphSVG: { shape: blobPath },
                    ease: "linear"
                });

                return tl;
            });
        }

        const rotationTl = () => {
            return gsap.timeline({ repeat: -1 }).to(svg, {
                rotation: 360,
                transformOrigin: "50% 50%",
                duration: 4,
                ease: "linear"
            });
        }

        blobTl();
        rotationTl();

        // Morph to different blob shapes


        return () => {
            timeline.kill();
        };
    }, []);


    return (
        <div className="absolute top-50 left-0 w-20 h-20 flex items-center justify-center overflow-hidden z-[999999]"
        >
         
            <div className="relative w-full h-full">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" ref={svgRef} preserveAspectRatio="none"
>
                    <path ref={svgPathRef} fill={"currentColor"} d="M56.6,-31.7C69.5,-10.3,73.5,17.2,62.6,36.2C51.6,55.3,25.8,65.8,-1,66.4C-27.8,67,-55.5,57.5,-69.9,36.5C-84.3,15.5,-85.2,-17.1,-71.3,-39.1C-57.5,-61.1,-28.7,-72.5,-3.4,-70.5C21.8,-68.5,43.7,-53.2,56.6,-31.7Z" transform="translate(100 100)" />
                </svg>
            </div>
        </div>
    );
}

export default AnimatedBlob;