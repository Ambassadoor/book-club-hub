import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getLibrary } from "../../services/libraryServices/libraryServices"
import { Box, Button, TextField } from "@mui/material"
import { googleBooksClient } from "../../api/googleBooksClient"

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
1
    useEffect(() => {
        userId && 
        getLibrary(Number(userId)).then(res => setLibrary(res))
    }, [userId])

    useEffect(() => {
        Object.values(searchParams).length > 0 &&
        search(searchParams, page).then(
            res => {
                setNumResults(Number(res.totalItems))
                setSearchResults(res.items)
            })

    },[searchParams, page])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPage(0)
        const field = e.target.name
        const term = e.target.value

        setSearchParams({...searchParams, [field]: term}) 
    }

    const handleNext = () => {
        setPage(page + 10)
    }

    const handlePrev = () => {
        page > 0 &&
        setPage(page - 10)
    }

    return (
        <>
            <TextField name="intitle" value={searchParams["intitle"] || ""} onChange={handleSearch}/>
            <ul>
                {searchResults.map(book => (
                    <li key={book.id}>{book.volumeInfo.title}</li>
                ))}
            </ul>
            <Box>
                <Button disabled={page === 0} onClick={handlePrev}>{"<"}</Button><Button disabled={!(page + searchResults.length < numResults)} onClick={handleNext}>{">"}</Button>
            </Box>
            <ul>
                {library.map(book => (
                    <li key={book.id} >{book.title}</li>
                ))}
            </ul>

        </>
    )
}