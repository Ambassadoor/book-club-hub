import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getLibrary } from "../../services/libraryServices/libraryServices"
import { Box } from "@mui/material"
import { BookList } from "./BookList"
import { SearchBar } from "../shared/SearchBar"
import { BookFull } from "./BookFull"
export interface SearchParams {
    intitle?: string,
    inauthor?: string,
    inpublisher?: string,
    subject?: string,
    isbn?: string,
    lccn?: string,
    oclc?: string,
}

export const Library = () => {
    const {userId} = useParams()
    const [library, setLibrary] = useState<UserBook[]>([])
    const [searchResults, setSearchResults] = useState<UserBook[] | GoogleBook[]>([])
    const [numResults, setNumResults] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const [book, setBook] = useState<UserBook | GoogleBook | null>(null)

    useEffect(() => {
        userId &&
        getLibrary(Number(userId)).then(res => setLibrary(res))
    }, [userId])

    useEffect(() => {
        book === null &&
        getLibrary(Number(userId)).then(res => setLibrary(res))
    },[book])

    useEffect(() => {
        setSearchResults(library)
    },[library])

    return (
        <Box className="flex flex-col md:flex-row bg-primary p-5 h-fit rounded-lg m-5 md:min-w-[1400px]">
            <Box className="flex flex-col h-fit bg-black rounded-lg p-5">
                <Box>
                    <SearchBar className="self-center pt-5" close fullWidth source={library} results={searchResults} setResults={setSearchResults} setTotal={setNumResults} page={page} setPage={setPage}/>
                </Box>
                <Box className="h-150 overflow-y-scroll no-scrollbar">
                    <BookList className="relative overflow-y-scroll no-scrollbar mt-0 m pt-0 p-5 rounded h-[530px]" list={searchResults} setBook={setBook} page={page} setPage={setPage} />
                </Box>
            </Box>
            <Box className="flex">
                {book && <BookFull user={Number(userId)} book={book} setBook={setBook}/>}
            </Box>
        </Box>
    )
}