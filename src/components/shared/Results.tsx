import { useEffect, useState } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { useBooksSearch } from "../../hooks/useBooksSearch"
import { PaginatedList } from "./PaginatedList"
import { BookSearchResult } from "../library/BookSearchResult"
import { SearchBar1 } from "./ReconfigSearchBar"
import { googleAdapter } from "../../services/searchAdapters/googleAdapter"
import { Box } from "@mui/material"

export const Results = () => {
    const {source, query} = useParams()
    const {search: bookSearch} = useBooksSearch()
    const {search: clubSearch} = useBooksSearch()
    const location = useLocation()
    const routerResults = location.state;
    const [results, setResults] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        if (routerResults) {
            setResults(routerResults);
            return
        }

        if (!results && query) {
            const search =
                source === "Google Books" ? bookSearch : clubSearch

            search(query).then((res) => setResults(res.items));
        } 
    }, [routerResults, source, query])

    return (
        <Box className="flex flex-col">
            <SearchBar1 adapters={[googleAdapter(bookSearch, navigate)]} hideOptions onSearchResults={(q,r) => setResults(r)} initialQuery={query} initialResults={results}/>
            <PaginatedList results={results.map(r => {return {book: r}})} Child={BookSearchResult}/>
        </Box>
    )
}
