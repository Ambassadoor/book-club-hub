import { useRef } from "react";

const googleKey = import.meta.env.VITE_GOOGLE_BOOK_KEY

type BooksResponse = {
    kind: string,
    totalItems: number,
    items: GoogleBook[]
}

type Stored = {
    timestamp: number;
    data: BooksResponse
}

const memoryCache = new Map<string, BooksResponse>();

export const useBooksSearch = () => {
    const controllerRef = useRef<AbortController | null>(null);

    const search = async (query: string, startIndex = 0) => {
        if (query.length < 3) return null;

        const normalized = query.trim().toLowerCase().replace(/\s+/g, " ");
        const key = `${normalized}|${startIndex}`;

        if (memoryCache.has(key)) {
            return memoryCache.get(key)!;
        }

        const TTL = 1000 * 60 *60

        const stored = sessionStorage.getItem(key);
        if (stored) {
            const parsed: Stored = JSON.parse(stored);
            if (Date.now() - parsed.timestamp < TTL) {
                memoryCache.set(key, parsed.data);
                return parsed.data
            }
        }

        controllerRef.current?.abort();
        controllerRef.current = new AbortController();

        try {
            const res = await fetch(
                `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=20&printType=books&projection=lite&langRestrict=en&key=${googleKey}`,
                { signal: controllerRef.current.signal}
            );

            if (!res.ok) {
                console.error("Books API error:", res.status, res.statusText)
                return null
            }
            const data = await res.json()

            memoryCache.set(key, data.items);
            sessionStorage.setItem(key, JSON.stringify(data.items))


            return data.items;
        } catch (err) {
            if ((err as DOMException).name === "AbortError") {
                console.log("Fetch aborted")
                return;
            }

            console.error("Fetch failed", err)
            return;
        }
    }

    return { search }
}

