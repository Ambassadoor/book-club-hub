import { Box, List, Pagination } from "@mui/material"
import { SearchBar } from "../shared/SearchBar"
import { useEffect, useState } from "react"
import { BookSearchResult, type GoogleBookWithInLibrary } from "./BookSearchResult"
import { useBchApi } from "../../hooks/useBchApi"
import { BookFull } from "./BookFull"
import { useParams } from "react-router-dom"
import { BookList } from "./BookList"

type BooksProps = {
    user: number | null
}

//A Book search and result display component
export const Books = ({user}: BooksProps) => {
    const {clubId} = useParams()
    const [results, setResults] = useState<GoogleBookWithInLibrary[] | GoogleBook[]>([])
    const [count, setCount] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const [open, setOpen] = useState(false)
    const { data: userBooks, refetch} = useBchApi(`?userId=${user}`)
    const [book, setBook] = useState<GoogleBook | GoogleBookWithInLibrary | UserBook | null>(null)


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

    const handlePageChange = (_: unknown, value: number) => {
        setPage(value-1)
    }

    useEffect(() => {
        if (results?.length > 0) {
            setOpen(true)
        }
    },[results])

    useEffect(() => {
        setOpen(false)
    }, [book])

    return (
        <Box className="flex flex-col md:flex-row bg-primary p-5 h-fit rounded-lg m-5 md:min-w-[1400px]">
            <Box className="flex flex-col h-fit bg-black rounded-lg p-5">
                <Box>
                    <SearchBar className="self-center pt-5" close fullWidth targets={["googleBooks"]} results={results} setResults={user && !clubId ? checkUserLibrary : setResults} setTotal={setTotal} page={page} setPage={setPage}/>
                </Box>
                <Box className="h-150 overflow-y-scroll no-scrollbar">
                    <BookList className="relative overflow-y-scroll no-scrollbar mt-0 m pt-0 p-5 rounded h-[530px]" list={results} setBook={setBook} page={page} setPage={setPage} />
                </Box>
            </Box>
            <Box className="flex">
                {book && <BookFull user={Number(user)} book={book} clubId={Number(clubId)} setBook={setBook} refetch={refetch}/>}
            </Box>
        </Box>
        // <Box className="relative max-w-full flex flex-col">
        //     <Box>
        //         <SearchBar close targets={["googleBooks"]} results={results} setResults={user && !clubId ? checkUserLibrary : setResults} page={page} setPage={setPage} setTotal={setTotal} fullWidth/>
        //     </Box>
        //     <Box hidden={!open} className="p-4 mt-3 relative z-10 bg-black rounded">
        //         <List className="">
        //             {
        //             results?.length > 0 &&
        //                 results.map(book => (
        //                         <BookSearchResult key={book.id} user={user} book={book} update={markAdded} setBook={setBook} />
        //                     ))}

        //         </List>
        //         <Pagination count={count} page={page + 1} onChange={handlePageChange} siblingCount={1} boundaryCount={0} />
        //     </Box>
        //     <Box className="absolute top-15 left-0 w-full z-1">
        //         {book && <BookFull book={book} setBook={setBook} clubId={Number(clubId)} user={Number(user)} refetch={refetch}/>}
        //     </Box>
        // </Box>
    )
}