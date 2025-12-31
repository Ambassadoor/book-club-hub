import { Box, List, Pagination } from "@mui/material"
import { useState } from "react"

export const PaginatedList = ({results, displayCount=10, Child}) => {
    const [page, setPage] = useState(1)

    //TODO: Add logic to check for additional results, display additional pages and handle fetching more results
    return (
        <Box>
            <List>
                {
                    results.slice((page-1)*displayCount, displayCount*page).map((result) => (
                        <Child key={result.id} book={result}/>
                    ))
                }
            </List>
            <Pagination page={page} onChange={(_, p) => setPage(p)} count={Math.ceil(results.length/displayCount)}/>
        </Box>
    )
}