import {Box, Typography} from "@mui/material"
import { useEffect, useState } from "react"
import { bchApi } from "../../api/bchBooksClient"
import { Club } from "../clubs/Club"
import { PaginatedList } from "../shared/PaginatedList"
import { BookSearchResult } from "../library/BookSearchResult"
import { getUserClubData } from "../../services/clubServices/clubServices"
import { ClubSearchResult } from "../clubs/ClubSearchResult"

export const Dashboard = ({user}) => {   
    const [bookList, setBookList] = useState()
    const [clubList, setClubList] = useState()

    const {request} = bchApi

    useEffect(() => {
        request(`?userId=${user}`).then(res => setBookList(res))
    }, [user])

    useEffect(() => {
        getUserClubData(user).then(res => setClubList(res))
    }, [user])

    return (
        user && bookList && clubList &&
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:w-full max-w-[1600px] mx-auto md:h-fit">
            <div className="flex flex-col p-3 rounded-lg md:h-[750px]">
                <Box 
                    sx={{
                        bgcolor: 'background.paper',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        p: 3
                    }}
                >
                    <div className="mb-2 p-3">
                        <Typography variant="h5" sx={{ fontWeight: 600 }}>My Library</Typography>
                    </div>
                    <div className="flex-1 overflow-auto px-3 pb-3 flex flex-col justify-end">
                        <PaginatedList results={bookList.map(b => {return {book: b}})} Child={BookSearchResult} displayCount={5}/>
                    </div>
                </Box>
            </div>
            
            <div className="flex flex-col p-3 rounded-lg md:h-[750px]">
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
                    <div className="mb-2 p-3">
                        <Typography variant="h5" sx={{ fontWeight: 600}}>My Clubs</Typography>
                    </div>
                    <div className="flex-1 overflow-auto px-3 pb-3 flex flex-col justify-end">
                        <PaginatedList results={clubList?.map(c => {return {club: c}})} Child={ClubSearchResult} displayCount={3}/>
                    </div>
                </Box>
            </div>
        </div>
    )
}