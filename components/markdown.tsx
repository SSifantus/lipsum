import MarkdownToJsx from 'markdown-to-jsx';
import { CodeBlock } from './code-block';

interface MarkdownProps {
    content: string;
    className?: string;
}

interface HighlightedCodeBlockProps {
    children: {
        props?: {
            className?: string;
            children?: string;
            title?: string;
        };
    };
}

export function Markdown({ content, className }: MarkdownProps) {
    const HighlightedCodeBlock = ({ children }: HighlightedCodeBlockProps) => {
        const { props } = children;
        const matchLanguage = /lang-(\w+)/.exec(props?.className || '');
        return (
            <CodeBlock
                code={props?.children}
                lang={matchLanguage ? matchLanguage[1] : undefined}
                title={props?.title}
            />
        );
    };

    return (
        <MarkdownToJsx
            className={['markdown', className].filter(Boolean).join(' ')}
            options={{
                overrides: {
                    pre: HighlightedCodeBlock
                }
            }}
        >
            {content}
        </MarkdownToJsx>
    );
}
