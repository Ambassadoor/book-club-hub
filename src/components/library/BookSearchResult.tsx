import { Book } from "@mui/icons-material"
import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material"

type BookSearchResultProps = {
    book: UserBook | GoogleBook
}

export const BookSearchResult = ({book} : BookSearchResultProps) => {


    return (
        <ListItem className="my-1 bg-white rounded max-w-full p-0" alignItems="flex-start" disableGutters>
            <ListItemButton className="h-16 px-2 py-0">
                <ListItemAvatar>
                    <Avatar 
                        src={
                            "imageSmall" in book
                            ? book?.imageSmall || ""
                            : book?.volumeInfo?.imageLinks?.smallThumbnail || ""
                        }
                        variant="rounded"
                    >
                        <Book/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    className=""
                    primary={
                        "title" in book
                        ? <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{book?.title || ""}</span>
                        : <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{book.volumeInfo?.title || ""}</span>
                    }
                    secondary={
                        "author" in book
                        ? <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{book.author || ""}</span>
                        : <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{book.volumeInfo.authors?.join(", ") || ""}</span>
                    }/>
            </ListItemButton>
        </ListItem>
    )
}