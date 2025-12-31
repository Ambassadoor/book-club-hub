import { Box, List, Pagination, Typography } from "@mui/material"
import { useEffect, useLayoutEffect, useRef, useState } from "react"

export const PaginatedList = ({results, displayCount=10, Child, emptyMessage="", ...props}) => {
    const [page, setPage] = useState(1)
    const ref = useRef<HTMLUListElement>(null);
    const [minHeight, setMinHeight] = useState<number>();

    useLayoutEffect(() => {
        if (!ref.current) return;

        const nextHeight = ref.current.offsetHeight

        setMinHeight(prev =>
            Math.max(prev ?? 0, nextHeight)
        );
    }, [page, results])

    useEffect(() => {
        setPage(1)
    }, [results])

    //TODO: Add logic to check for additional results, display additional pages and handle fetching more results
    return (
        <Box >
            <List ref={ref} sx={{
                minHeight: minHeight,
                transition: "min-height 200ms ease"
                }} {...props}>
                {
                    results?.length > 0 ? results.slice((page-1)*displayCount, displayCount*page).map((result, index) => (
                        <Child key={index} {...result}/>
                    )) :    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 2 }}>
                                {emptyMessage ? emptyMessage : "No Data to Display"}
                            </Typography> 
                }
            </List>
            <Pagination page={page} onChange={(_, p) => setPage(p)} count={Math.ceil(results?.length/displayCount)}/>
        </Box>
    )
}