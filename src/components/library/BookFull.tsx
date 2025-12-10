import { Box, Typography } from "@mui/material"

type BookFullProps = {
    book: UserBook | GoogleBook
}

export const BookFull = ({book}: BookFullProps) => {

    let thumbnail
    let title
    let author
    let description
    
    "volumeInfo" in book 
    ?( 
        thumbnail = book.volumeInfo.imageLinks?.thumbnail || "", 
        title = book.volumeInfo?.title || "",
        author = book.volumeInfo?.authors.join(", ") || "",
        description = book.volumeInfo?.description || ""
    )
    : (
        thumbnail = book?.imageLarge || "",
        title = book?.title || "",
        author = book?.author || "",
        description = book?.description || ""
    )


    return (
        book &&
        <Box className="flex md:flex-row m-5 max-h-[60%]">
            <Box className="grow w-[50%] mr-5">
                <img className="w-full h-full object-contain" src={thumbnail}/>
            </Box>
            <Box className="flex flex-col shrink w-[50%] max-h-auto">
                <Typography className="dark:text-white" variant="h5">{title}</Typography>
                <Typography className="dark:text-white" variant="subtitle2">{author}</Typography>
                <Typography 
                    className="dark:text-white overflow-y-scroll no-scrollbar max-h-75"
                    variant="body2"
                    dangerouslySetInnerHTML={{
                        __html: description                        
                    }}
                    />
            </Box>
        </Box>
    )
}