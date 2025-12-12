import { Box, ButtonGroup, IconButton, List, Pagination } from "@mui/material"
import { SearchBar } from "../shared/SearchBar"
import { useEffect, useState } from "react"
import { BookSearchResult, type GoogleBookWithInLibrary } from "./BookSearchResult"
import { useBchApi } from "../../hooks/useBchApi"
import { BookFull } from "./BookFull"
import { NavigateBefore, NavigateNext } from "@mui/icons-material"
import { useParams } from "react-router-dom"

type BooksProps = {
    user: number
}

export const Books = ({user}: BooksProps) => {
    const {clubId} = useParams()
    const [results, setResults] = useState<GoogleBookWithInLibrary[] | GoogleBook[]>([])
    const [count, setCount] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const [open, setOpen] = useState(false)
    const { data: userBooks, refetch} = useBchApi(`?userId=${user}`)
    const [book, setBook] = useState<GoogleBook | UserBook | null>(null)


    const checkUserLibrary = (res:GoogleBook[]) => {
        if (!userBooks) return
        const response = res.map(book => ({
            ...book,
            inLibrary: userBooks.some(b => b.googleId === book.id)
        }))
        setResults(response)
    }

    const markAdded = (id: string) => {
        setResults(prev => 
            prev.map(book =>
                book.id === id ? {...book, inLibrary: true} : book
            ) 
        )
    }

    useEffect(() => {
        setCount(Math.ceil(total/10))
    }, [total])

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value-1)
    }

    useEffect(() => {
        if (results?.length > 0) {
            setOpen(true)
        }
    },[results])

    useEffect(() => {
        setOpen(false)
        setResults([])
    }, [book])

    return (
        <Box className="relative">
            <Box>
                <SearchBar close targets={["googleBooks"]} results={results} setResults={user && !clubId ? checkUserLibrary : setResults} page={page} setPage={setPage} setTotal={setTotal} fullWidth/>
            </Box>
            <Box hidden={!open} className="p-4 mt-3 relative z-10 bg-black rounded">
                <List className="">
                    {
                        results?.length > 0 &&
                        <Box>
    {                                results.map(book => (
                                <BookSearchResult key={book.id} user={user} book={book} update={markAdded} setBook={setBook} />
                            ))}
    \                               <Pagination count={count} page={page + 1} onChange={handlePageChange} siblingCount={1} boundaryCount={0} />
                        </Box>
                    }
                </List>
            </Box>
            <Box className="absolute top-15 left-0 w-full z-1">
                {book && <BookFull book={book} setBook={setBook} clubId={clubId} user={user} refetch={refetch}/>}
            </Box>
        </Box>
    )
}