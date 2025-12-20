import { Box, List, Pagination } from "@mui/material"
import { BookSearchResult } from "./BookSearchResult"
import { useEffect, useState } from "react"


type BookListProps = {
    className?: string,
    list: UserBook[] | GoogleBook[],
    setBook?: React.Dispatch<React.SetStateAction<UserBook | GoogleBook | null>>,
    page?: number,
    setPage?: React.Dispatch<React.SetStateAction<number>>
}

//A Paginated list of book search results
export const BookList = ({className, list, setBook, page, setPage}: BookListProps) => {
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
        <Box className="relative">
            <Box className={`${className}`}>
                <List className="flex flex-col max-w-full" dense>
                    {
                        list.length > 0 && list.slice(index,index+10).map(book => (
                            <BookSearchResult key={book.id} book={book} setBook={setBook} />
                        ))
                    }
                </List>
            </Box>
            <Pagination className="sticky bottom-0 bg-black pt-5" count={count} onChange={handlePageChange} page={page}/>
        </Box>
    )
}