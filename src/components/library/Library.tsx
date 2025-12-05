import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getLibrary } from "../../services/libraryServices/libraryServices"
import { TextField } from "@mui/material"
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
    const [page, setPage] = useState<number>(0)
    const {search} = googleBooksClient()
1
    useEffect(() => {
        userId && 
        getLibrary(Number(userId)).then(res => setLibrary(res))
    }, [userId])

    useEffect(() => {
        Object.values(searchParams).length > 0 &&
        search(searchParams, page).then(res => setSearchResults(res.items))

    },[searchParams, page])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const field = e.target.name
        const term = e.target.value

        setSearchParams({...searchParams, [field]: term}) 
    }

    return (
        <>
            <TextField name="intitle" value={searchParams["intitle"] || ""} onChange={handleSearch}/>
            <ul>
                {searchResults.map(book => (
                    <li key={book.id}>{book.volumeInfo.title}</li>
                ))}
            </ul>
            <ul>
                {library.map(book => (
                    <li key={book.id} >{book.title}</li>
                ))}
            </ul>
        </>
    )
}