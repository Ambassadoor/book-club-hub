import { List } from "@mui/material"
import { BookSearchResult } from "./BookSearchResult"


type BookListProps = {
    list: UserBook[] | GoogleBook[]
}
export const BookList = ({list}: BookListProps) => {

    return (
        <List className="flex flex-col max-w-full md:max-w-[30%]" dense>
            {
                list.length > 0 && list.map(book => (
                    <BookSearchResult key={book.id} book={book} />
                ))
            }
        </List>
    )
}