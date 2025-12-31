import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { getLibrary } from "../../services/libraryServices/libraryServices"
import { Box } from "@mui/material"
import { BookFull } from "./BookFull"
import { PaginatedList } from "../shared/PaginatedList"
import { BookSearchResult } from "./BookSearchResult"
import { SearchBar1 } from "../shared/ReconfigSearchBar"
import debounce from "lodash.debounce"

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
    const [book, setBook] = useState<UserBook | GoogleBook | null>(null)
    const [term, setTerm] = useState("")

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

    const search = useCallback((term, items) => {
        return items.filter(item => {
            return Object.values(item).some(v => 
                String(v).toLowerCase().includes(term.toLowerCase())
            )
        })
    }, [])

    const updateSearchResults = useMemo(() => 
        debounce((term, items) => {
            setSearchResults(search(term, items))
        }, 300), 
    [search])

    useEffect(() => {
        updateSearchResults(term, library)
        return () => updateSearchResults.cancel()
    }, [term, library, updateSearchResults])

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
                    <SearchBar1
                        adapters={[]}
                        hideOptions
                        getSearchTerm={(term) => setTerm(term)}
                    />
                </Box>
                <Box 
                    className="overflow-y-auto" 
                    sx={{ 
                        height: '600px',
                        p: 2,
                    }}
                >
                    <PaginatedList displayCount={5} results={searchResults?.map((result) => {return {
                        book: result,
                        user: userId,
                        setBook: setBook
                    }})} Child={BookSearchResult}/>
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