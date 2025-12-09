import { Box, Typography } from "@mui/material"

export const BookFull = (book) => {

    return (
        book &&
        <Box className="flex md:flex-row m-5 max-h-[60%]">
            <Box className="grow w-[50%] mr-5">
                <img className="w-full h-full object-contain" src={book.book?.volumeInfo?.imageLinks?.thumbnail}/>
            </Box>
            <Box className="flex flex-col shrink w-[50%] max-h-auto">
                <Typography className="dark:text-white" variant="h5">{book.book?.volumeInfo?.title}</Typography>
                <Typography className="dark:text-white" variant="subtitle2">{book.book?.volumeInfo?.authors?.[0]}</Typography>
                <Typography 
                    className="dark:text-white overflow-y-scroll no-scrollbar max-h-75"
                    variant="body2"
                    dangerouslySetInnerHTML={{
                        __html: 
                            "description" in book
                            ? book?.book?.description
                            : book?.book?.volumeInfo?.description                         
                        
                    }}
                    />
            </Box>
        </Box>
    )
}