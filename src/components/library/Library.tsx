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
        <Box>
            <SearchBar close fullWidth source={library} results={searchResults} setResults={setSearchResults} setTotal={setNumResults} page={page} setPage={setPage}/>
            <Box>
                <BookList className="overflow-y-scroll no-scrollbar max-h-50 md:max-h-full m-5 bg-black p-5 rounded" list={searchResults} setBook={setBook} page={page} setPage={setPage} />
            </Box>
            <Box>
                {book && <BookFull user={Number(userId)} book={book} setBook={setBook}/>}
            </Box>
        </Box>
    )
}