import { getNetlifyContext } from 'utils';
import { Alert } from './alert';
import { Markdown } from './markdown';

const noNetlifyContextAlert = `
For full functionality, either run this site locally via \`netlify dev\`
([see docs](https://docs.netlify.com/cli/local-development/")) or deploy it to Netlify.
`;

interface ContextAlertProps {
    addedChecksFunction?: (context: string) => string;
    className?: string;
}

export function ContextAlert(props: ContextAlertProps) {
    const { addedChecksFunction, className } = props;
    const ctx = getNetlifyContext();

    let markdownText: string | null = null;
    if (!ctx) {
        markdownText = noNetlifyContextAlert;
    } else if (addedChecksFunction) {
        markdownText = addedChecksFunction(ctx);
    }

    if (markdownText) {
        return (
            <Alert className={className}>
                <Markdown content={markdownText} />
            </Alert>
        );
    } else {
        return <></>;
    }
}
