import { Box, List, Pagination, Typography } from "@mui/material"
import { BookSearchResult } from "./BookSearchResult"
import { useEffect, useState } from "react"


type BookListProps = {
    list: UserBook[] | GoogleBook[],
    setBook?: React.Dispatch<React.SetStateAction<UserBook | GoogleBook | null>>,
    page?: number,
    setPage?: React.Dispatch<React.SetStateAction<number>>
}

//A Paginated list of book search results
export const BookList = ({list, setBook, page, setPage}: BookListProps) => {
    const [count, setCount] = useState(0)
    const [index, setIndex] = useState(0)

    const handlePageChange = (_:unknown,value: number) => {
        setPage && setPage(value)
        page && setIndex((page-1)*10)
    }

    useEffect(() => {
        setCount(Math.ceil(list.length/10))
    },[list])

    useEffect(() => {
        page && setIndex((page-1)*10)
    },[page])

    return (
        <div className="relative flex flex-col h-full w-full overflow-x-hidden">
            <div className="flex-1 overflow-auto w-full">
                <List className="flex flex-col w-full" dense sx={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}>
                    {
                        list.length > 0 ? list.slice(index,index+10).map(book => (
                            <BookSearchResult key={book.id} book={book} setBook={setBook} />
                        )) : (
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                align="center" 
                                sx={{ py: 4 }}
                            >
                                No books found. Try a different search.
                            </Typography>
                        )
                    }
                </List>
            </div>
            {count > 1 && (
                <div className="sticky bottom-0 flex justify-center pt-2 pb-1">
                    <Box 
                        sx={{ 
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            bgcolor: 'background.paper',
                            borderTop: 1,
                            borderColor: 'divider',
                        }}
                    >
                        <Pagination 
                            count={count} 
                            onChange={handlePageChange} 
                            page={page}
                            color="primary"
                            size="small"
                        />
                    </Box>
                </div>
            )}
        </div>
    )
}