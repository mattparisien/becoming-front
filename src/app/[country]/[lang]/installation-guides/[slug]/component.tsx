import Container from "@/components/Container";
import TextModule from "@/components/modules/Text";
import { PortableTextBlock } from '@portabletext/types';

interface InstallationGuideProps {
    title?: string;
    image?: {
        url?: string;
    };
    content?: PortableTextBlock[];
}

const InstallationGuideComponent = (props: InstallationGuideProps) => {
    return (
        <div className="pt-10">
            <div className="mb-18">
                <h1 className="text-3xl md:text-4xl lg:text-5xl mb-12 text-center font-serif font-light">{props.title}</h1>
                {/* {props.image?.url && (
                    <Image 
                        src={props.image.url} 
                        alt={props.title || 'Installation guide image'} 
                        width={1200}
                        height={400}
                        className="w-full max-w-3xl mx-auto rounded-lg max-h-96 object-cover"
                    />
                )} */}
            </div>
            {props.content && <Container><TextModule content={props.content} contentMaxWidth="xl" alignment="left" /></Container>}
        </div>
    );
}

export default InstallationGuideComponent;