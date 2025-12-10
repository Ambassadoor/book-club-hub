import { Box, List, Pagination } from "@mui/material"
import { BookSearchResult } from "./BookSearchResult"
import { useEffect, useState } from "react"


type BookListProps = {
    className?: string,
    list: UserBook[] | GoogleBook[],
    setBook?: React.Dispatch<React.SetStateAction<UserBook>>,
    page?: number,
    setPage?: React.Dispatch<React.SetStateAction<number>>
}
export const BookList = ({className, list, setBook, page, setPage}: BookListProps) => {
    const [count, setCount] = useState(0)
    const [index, setIndex] = useState(0)

    const handlePageChange = (_:unknown,value: number) => {
        setPage(value)
        setIndex((page-1)*10)
    }

    useEffect(() => {
        setCount(Math.ceil(list.length/10))
    },[list])

    useEffect(() => {
        setIndex((page-1)*10)
    },[page])

    return (
        <Box>
            <Box className={className}>
                <List className="flex flex-col max-w-full md:max-w-[30%]" dense>
                    {
                        list.length > 0 && list.slice(index,index+10).map(book => (
                            <BookSearchResult key={book.id} book={book} setBook={setBook} />
                        ))
                    }
                </List>
            </Box>
            <Pagination count={count} onChange={handlePageChange} page={page}/>
        </Box>
    )
}