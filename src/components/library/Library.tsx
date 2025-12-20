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
        <Box 
            className="flex flex-col lg:flex-row gap-6 p-6 mx-auto max-w-[1600px]"
            sx={{
                minHeight: '600px',
            }}
        >
            <Box 
                className="flex flex-col rounded-lg shadow-lg"
                sx={{
                    flex: '0 0 auto',
                    width: { xs: '100%', lg: '480px' },
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
                    <SearchBar 
                        className="w-full" 
                        close 
                        fullWidth 
                        source={library} 
                        results={searchResults} 
                        setResults={setSearchResults} 
                        setTotal={setNumResults} 
                        page={page} 
                        setPage={setPage}
                    />
                </Box>
                <Box 
                    className="overflow-y-auto" 
                    sx={{ 
                        height: '600px',
                        p: 2,
                    }}
                >
                    <BookList 
                        list={searchResults} 
                        setBook={setBook} 
                        page={page} 
                        setPage={setPage} 
                    />
                </Box>
            </Box>
            <Box 
                className="flex-1 rounded-lg shadow-lg"
                sx={{
                    minHeight: '600px',
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    display: book ? 'flex' : 'none',
                }}
            >
                {book && <BookFull user={Number(userId)} book={book} setBook={setBook}/>}
            </Box>
        </Box>
    )
}