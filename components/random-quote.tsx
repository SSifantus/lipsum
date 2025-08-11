'use client';

import { useEffect, useState } from 'react';
import { Card } from './card';

interface Quote {
    text: string;
    playedBy: string;
    character: string;
    film: string;
    year: number;
    dataSource: string;
}

const randomQuoteUrl = '/quotes/random';

export function RandomQuote() {
    const [quote, setQuote] = useState<Quote | null>(null);
    const [time, setTime] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const response = await fetch(randomQuoteUrl, { cache: 'no-store' });
                if (response) {
                    const data: Quote = await response.json();
                    setQuote(data);
                    setTime(new Date().toLocaleString());
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchQuote();
    }, []);

    return (
        <Card>
            {quote ? (
                <>
                    <h3 className="text-neutral-900">&ldquo;{quote.text}&rdquo;</h3>
                    <p>
                        - {quote.playedBy} as {quote.character} in &ldquo;{quote.film}&rdquo; ({quote.year})
                    </p>
                    <p className="pt-2 mt-2 text-sm italic border-t border-dashed text-secondary border-neutral-300">
                        loaded at {time}. <a href={quote.dataSource}>Original data source.</a>
                    </p>
                </>
            ) : (
                <>Loading...</>
            )}
        </Card>
    );
}
