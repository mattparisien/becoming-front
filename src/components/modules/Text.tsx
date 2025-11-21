import { PortableText, PortableTextComponents } from '@portabletext/react';
import { PortableTextBlock } from '@portabletext/types';
import TransitionLink from '@/components/TransitionLink';
import classNames from 'classnames';
import CodeBlock from '@/components/CodeBlock';
import { IoCheckmark } from 'react-icons/io5';

interface TextModuleProps {
    content: PortableTextBlock[];
    contentMaxWidth?: string;
    alignment: 'left' | 'center' | 'right';
    headingFont?: 'sans' | 'serif';
}

const TextModule = ({ content, contentMaxWidth, alignment = 'left', headingFont = 'sans' }: TextModuleProps) => {
    if (!content) {
        return null;
    }

    const fontClass = headingFont === 'serif' ? 'font-serif font-medium' : 'font-sans';
    const alignmentClass = {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
    }[alignment];

    // Custom components for rendering different block types
    const components: PortableTextComponents = {
        block: {
            // Customize heading styles
            h1: ({ children }) => <h1 className={classNames("text-3xl mb-6", fontClass)}>{children}</h1>,
            h2: ({ children }) => <h2 className={classNames("text-4xl leading-[1.2] text-4xl sm:text-5xl xl:text-6xl mb-6 [&_a]:no-underline [&_a]:relative [&_a]:inline-block [&_a]:after:content-[''] [&_a]:after:absolute [&_a]:after:bottom-0 [&_a]:after:left-0 [&_a]:after:w-full [&_a]:after:h-[2px] [&_a]:after:bg-[length:10px_2px] [&_a]:after:bg-repeat-x [&_a]:after:bg-[linear-gradient(to_right,currentColor_0,currentColor_6px,transparent_6px,transparent_10px)] [&_a:hover]:after:animate-[dash-slide-steps_0.4s_steps(3)_infinite]", fontClass)}>{children}</h2>,
            h3: ({ children }) => <h3 className={classNames("text-3xl mb-5", fontClass)}>{children}</h3>,
            h4: ({ children }) => <h4 className={classNames("text-xl mb-4 mt-8", fontClass)}>{children}</h4>,
            h5: ({ children }) => <h5 className={classNames("text-sm font-medium mb-4 mt-6", fontClass)}>{children}</h5>,
            h6: ({ children }) => <h6 className={classNames("text-sm  mb-2 mt-6", fontClass)}>{children}</h6>,
            normal: ({ children }) => <p className="mb-5 leading-relaxed">{children}</p>,
            small: ({ children }) => <p className="text-sm mb-4 leading-relaxed">{children}</p>,
            extraSmall: ({ children }) => <p className="text-xs mb-3 leading-relaxed">{children}</p>,
            blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-gray-300 pl-4 italic my-6">
                    {children}
                </blockquote>
            ),
        },
        types: {
            divider: ({ value }) => {
                const style = (value?.style || 'solid') as 'solid' | 'dashed' | 'dotted';
                const borderStyleClass = {
                    solid: 'border-solid',
                    dashed: 'border-dashed',
                    dotted: 'border-dotted',
                }[style];
                
                return (
                    <hr className={classNames('my-10 border-foreground/15', borderStyleClass)} />
                );
            },
            codeBlock: ({ value }) => <CodeBlock value={value} />,
        },
        marks: {
            // Customize text decorations
            strong: ({ children }) => <strong className='font-semibold'>{children}</strong>,
            serif: ({ children }) => <span className="font-serif">{children}</span>,
            em: ({ children }) => <em className="italic">{children}</em>,
            code: ({ children }) => (
                <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono">
                    {children}
                </code>
            ),
            // Handle internal links from Sanity
            linkInternal: ({ children, value }) => {
                const slug = value?.reference?.slug?.current || value?.slug?.current || '';
                const href = slug ? `/${slug}` : '/';
                
                return (
                    <TransitionLink 
                        href={href}
                        className="text-blue-600 hover:text-blue-800 underline"
                    >
                        {children}
                    </TransitionLink>
                );
            },
            // Handle email links from Sanity
            linkEmail: ({ children, value }) => {
                const email = value?.email || '';
                
                return (
                    <a
                        href={`mailto:${email}`}
                        className="underline"
                    >
                        {children}
                    </a>
                );
            },
            // Handle external links from Sanity
            link: ({ children, value }) => {
                const href = value?.href || '';
                const isExternal = value?.blank || false;
                
                // Check if it's an email link
                if (href.startsWith('mailto:')) {
                    return (
                        <a
                            href={href}
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            {children}
                        </a>
                    );
                }
                
                // Check if it's an external link (http/https) or explicitly marked as external
                const isExternalUrl = href.startsWith('http://') || href.startsWith('https://') || isExternal;
                
                if (isExternalUrl) {
                    return (
                        <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            {children}
                        </a>
                    );
                }
                
                // Internal link - use TransitionLink
                return (
                    <TransitionLink 
                        href={href}
                        className="text-blue-600 hover:text-blue-800 underline"
                    >
                        {children}
                    </TransitionLink>
                );
            },
        },
        list: {
            bullet: ({ children }) => <ul className="mb-5 space-y-1">{children}</ul>,
            number: ({ children }) => <ol className="list-decimal list-inside mb-5 space-y-2">{children}</ol>,
        },
        listItem: {
            bullet: ({ children }) => (
                <li className="flex items-start gap-2">
                    <IoCheckmark className="mt-1 flex-shrink-0 w-3 h-3" />
                    <span className="flex-1">{children}</span>
                </li>
            ),
            number: ({ children }) => <li className="ml-4">{children}</li>,
        },
    };

    const maxWidthClassMap = {
        'sm': 'max-w-sm',
        'md': 'max-w-md',
        'lg': 'max-w-lg',
        'xl': 'max-w-xl',
        'full': 'max-w-full',
    }

    return (
        <div className={classNames("text-foreground prose prose-lg font-light mx-auto [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&_li_p]:mb-0", alignmentClass, {
            [maxWidthClassMap[contentMaxWidth as keyof typeof maxWidthClassMap]]: contentMaxWidth,
            'max-w-none': !contentMaxWidth,
        })}>
            <PortableText value={content} components={components} />
        </div>
    );
};

export default TextModule;