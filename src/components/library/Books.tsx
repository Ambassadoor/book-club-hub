import { Accordion, AccordionDetails, AccordionSummary, Box, List, Pagination, Typography } from "@mui/material"
import { SearchBar } from "../shared/SearchBar"
import { useEffect, useState } from "react"
import { BookSearchResult, type GoogleBookWithInLibrary } from "./BookSearchResult"
import { useBchApi } from "../../hooks/useBchApi"
import { BookFull } from "./BookFull"
import { useParams } from "react-router-dom"
import { BookList } from "./BookList"
import { ExpandMore } from "@mui/icons-material"

type BooksProps = {
    user: number | null
}

//A Book search and result display component
export const Books = ({user}: BooksProps) => {
    const {clubId} = useParams()
    const [results, setResults] = useState<GoogleBookWithInLibrary[] | GoogleBook[]>([])
    const [count, setCount] = useState<number>(1)
    const [total, setTotal] = useState<number>(0)
    const [page, setPage] = useState<number>(0)
    const [open, setOpen] = useState(false)
    const { data: userBooks, refetch} = useBchApi(`?userId=${user}`)
    const [book, setBook] = useState<GoogleBook | GoogleBookWithInLibrary | UserBook | null>(null)
    const [expanded, setExpanded] = useState(true)

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
        setCount(Math.ceil(total/10))
    }, [total])

    const handlePageChange = (_: unknown, value: number) => {
        setPage(value-1)
    }

    useEffect(() => {
        if (results?.length > 0) {
            setOpen(true)
            setExpanded(true)
        }
    },[results])

    useEffect(() => {
        setOpen(false)
        setExpanded(false)
    }, [book])

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
                    <SearchBar 
                        className="w-full" 
                        close 
                        fullWidth 
                        targets={["googleBooks"]} 
                        results={results} 
                        setResults={user && !clubId ? checkUserLibrary : setResults} 
                        setTotal={setTotal} 
                        page={page} 
                        setPage={setPage}
                    />
                </Box>
                <Box 
                    className={`overflow-y-auto ${expanded && "h-[600px]"} w-full p-2`}
                >
                    <Accordion defaultExpanded expanded={expanded} onChange={() => setExpanded((prev) => !prev)}>
                        <AccordionSummary
                            expandIcon={<ExpandMore/>}
                        >
                            <Typography component="span">Search Results</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <BookList
                                list={results}
                                setBook={setBook}
                                page={page}
                                setPage={setPage}
                            />
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