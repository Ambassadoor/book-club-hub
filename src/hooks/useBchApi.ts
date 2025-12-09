import { useEffect, useState, useCallback, useMemo } from "react";
import { bchApi } from "../api/bchBooksClient";

export const useBchApi = (
    path: string, 
    options?: Options
    ) => {
    const [data, setData] = useState<UserBook[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null)

    const finalOptions = useMemo(() => ({
        method: "GET",
        headers: {"Content-Type": "application/json"},
        ...options
    }),[options])

    const callApi = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const result = await bchApi.request(path, finalOptions as Options)
            setData(result)
        } catch (err) {
            setError(
                err instanceof Error
                ? err
                : new Error(String(err))
            )
        } finally {
            setLoading(false)
        }
    },[path, finalOptions])

    useEffect(() => {
        callApi();
    }, [callApi])   

    return { data, loading, error, refetch: callApi }
}