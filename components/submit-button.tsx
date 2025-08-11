'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
    text?: string;
}

export function SubmitButton({ text = 'Submit' }: SubmitButtonProps) {
    const { pending } = useFormStatus();
    return (
        <button className="btn" type="submit" disabled={pending}>
            {text}
        </button>
    );
}
