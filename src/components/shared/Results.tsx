import { useEffect, useState } from "react"
import { useLocation, useParams } from "react-router-dom"
import { useBooksSearch } from "../../hooks/useBooksSearch"
import { BookList } from "../library/BookList"
import { Club } from "../clubs/Club"

export const Results = () => {
    const {source, query} = useParams()
    const {search: bookSearch} = useBooksSearch()
    const {search: clubSearch} = useBooksSearch()
    const location = useLocation()
    const routerResults = location.state;
    const [results, setResults] = useState([])

    useEffect(() => {
        if (routerResults) {
            setResults(routerResults);
            return
        }

        if (!results && query) {
            const search =
                source === "Google Books" ? bookSearch : clubSearch

            search(query).then(setResults);
        } 
    }, [routerResults, source, query])

    return (
        <>
            {
            source === "Google Books"
            ? <BookList list={results}/>
            : <Club />
            }
        </>
    )
}
