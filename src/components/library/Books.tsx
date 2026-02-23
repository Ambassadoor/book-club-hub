import { Accordion, AccordionDetails, AccordionSummary, Box, Typography, useMediaQuery } from "@mui/material"
import { SearchBar } from "../shared/SearchBar"
import { useEffect, useMemo, useState } from "react"
import { BookSearchResult, type GoogleBookWithInLibrary } from "./BookSearchResult"
import { useBchApi } from "../../hooks/useBchApi"
import { BookFull } from "./BookFull"
import { useNavigate, useParams } from "react-router-dom"
import { BookList } from "./BookList"
import { ExpandMore } from "@mui/icons-material"
import { SearchBar1 } from "../shared/ReconfigSearchBar"
import { googleAdapter } from "../../services/searchAdapters/googleAdapter"
import { useBooksSearch } from "../../hooks/useBooksSearch"
import { PaginatedList } from "../shared/PaginatedList"

type BooksProps = {
    user: number | null
}

//A Book search and result display component
export const Books = ({user}: BooksProps) => {
    const {clubId} = useParams()
    const [results, setResults] = useState<GoogleBookWithInLibrary[] | GoogleBook[]>([])
    const { data: userBooks, refetch} = useBchApi(`?userId=${user}`)
    const [book, setBook] = useState<GoogleBook | GoogleBookWithInLibrary | UserBook | null>(null)
    const [expanded, setExpanded] = useState(true)

    const isLarge = useMediaQuery(`(min-width:1024px)`)
    const {search} = useBooksSearch()
    const navigate = useNavigate()

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
        if (results?.length > 0) {
            setExpanded(true)
        }
    },[results])

    useEffect(() => {
        if (isLarge) return;
        setExpanded(false)
    }, [book])

    const mappedResults = useMemo(() => 
        results.map((r) => ({
            user: user,
            book: r,
            setBook: setBook
        }))
    , [results, user])

    return (
        <Box 
            className={`flex flex-col lg:flex-row gap-6 mx-auto max-w-[1600px] overflow-x-hidden ${expanded && "min-h-[600px]"} w-full`}
        >
            <Box 
                className="flex flex-col rounded-lg shadow-lg flex-none w-full lg:w-[480px] max-w-full min-w-0 overflow-hidden"
                sx={{
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                }}
            >
                <Box className="p-3" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <SearchBar1 adapters={[googleAdapter(search, navigate)]} hideOptions onSearchResults={(q,r) => setResults(r)}/>

                </Box>
                <Box 
                    className={`overflow-y-auto ${expanded && "h-full"} w-full p-2`}
                >
                    <Accordion defaultExpanded expanded={expanded} onChange={() => setExpanded((prev) => !prev)}>
                        <AccordionSummary
                            expandIcon={<ExpandMore/>}
                        >
                            <Typography component="span">Search Results</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <PaginatedList results={mappedResults} displayCount={7} Child={BookSearchResult}/>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
            <Box 
                className="flex-1 rounded-lg shadow-lg min-h-[600px]"
                sx={{
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                    display: book ? 'flex' : 'none',
                }}
            >
                {book && 
                
                <BookFull user={Number(user)} book={book} clubId={Number(clubId)} setBook={setBook} refetch={refetch}/>}
                
            </Box>
        </Box>
    )
}