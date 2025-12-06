import { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import { getLibrary } from "../../services/libraryServices/libraryServices"
import { Box, Button, List, TextField } from "@mui/material"
import { googleBooksClient } from "../../api/googleBooksClient"
import { Book } from "./Book"
import { BookSearchResult } from "./BookSearchResult"
import { BookList } from "./BookList"
import debounce  from "lodash.debounce"
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
    const [searchParams, setSearchParams] = useState<SearchParams>({})
    const [searchResults, setSearchResults] = useState<GoogleBook[]>([])
    const [numResults, setNumResults] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const {search} = googleBooksClient()

    const debouncedSearch = useCallback(debounce((params, pageNum) => {
        search(params, pageNum).then(
            res => {
                setNumResults(Number(res.totalItems))
                setSearchResults(res.items)
            }
        )
    }, 300), [search]) 

    useEffect(() => {
        if (Object.values(searchParams).length > 0) {
            debouncedSearch(searchParams, page)
        } else {
            setSearchResults([])
            setNumResults(0)
        }
        return () => debouncedSearch.cancel()
    }, [searchParams, page, debouncedSearch])

    useEffect(() => {
        userId && 
        getLibrary(Number(userId)).then(res => setLibrary(res))
    }, [userId])


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {  
        setPage(0)
        const field = e.target.name
        const term = e.target.value

        if (term==="") {
            setSearchParams({})
        } else {
            setSearchParams({...searchParams, [field]: term}) 
        }
    }

    return (
        <>
            <h2>Search</h2>
            <TextField name="intitle" value={searchParams["intitle"] || ""} onChange={handleSearch}/>
            <Box className="flex max-w-[90%] self-center">
                {searchResults?.length > 0 &&
                    <BookList list={searchResults}/>
                }
            </Box>
        </>
    )
}