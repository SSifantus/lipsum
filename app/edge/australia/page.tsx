import EdgeFunctionExplainer from '../explainer';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'In Australia'
};

export default function Page() {
    return (
        <>
            <h1 className="mb-8">You are in Australia!</h1>
            <EdgeFunctionExplainer />
        </>
    );
}
