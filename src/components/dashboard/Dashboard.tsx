import {Box, Typography} from "@mui/material"
import { BookList } from "../library/BookList"
import { useEffect, useState } from "react"
import { bchApi } from "../../api/bchBooksClient"
import { Club } from "../clubs/Club"

export const Dashboard = ({user}) => {   
    const [bookList, setBookList] = useState()
    const [page, setPage] = useState(1)

    const {request} = bchApi

    useEffect(() => {
        request(`?userId=${user}`).then(res => setBookList(res))
    }, [user])

    return (
        user && bookList &&
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 max-w-[1600px] mx-auto md:h-fit">
            <div className="flex flex-col min-h-[600px] p-3 rounded-lg md:h-fit">
                <Box 
                    sx={{
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <div className="mb-2 p-3">
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>My Library</Typography>
                    </div>
                    <div className="flex-1 overflow-auto px-3 pb-3">
                        <BookList list={bookList} page={page} setPage={setPage}/>
                    </div>
                </Box>
            </div>
            
            <div className="flex flex-col min-h-[600px] p-3 rounded-lg">
                <Box 
                    sx={{
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 3,
                    }}
                >
                    <Club user={user} />
                </Box>
            </div>
        </div>
    )
}