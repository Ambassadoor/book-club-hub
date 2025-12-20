import {Box} from "@mui/material"
import { BookList } from "../library/BookList"
import { useEffect, useState } from "react"
import { bchApi } from "../../api/bchBooksClient"
import { Club } from "../clubs/Club"

export const Dashboard = ({user}) => {   
    const [bookList, setBookList] = useState()
    const [page, setPage] = useState(0)

    const {request} = bchApi

    useEffect(() => {
        request(`?userId=${user}`).then(res => setBookList(res))
    }, [user])

    return (
        user && bookList &&
        <Box className="flex gap-5 bg-accent h-fit p-10 rounded-lg">
            <BookList className="bg-black rounded-t-lg p-5" list={bookList} page={page} setPage={setPage}/>
            <Club user={user} />
        </Box>
    )
}