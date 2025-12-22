import { SearchBar1 } from "./src/components/shared/ReconfigSearchBar"
import { googleAdapter } from "./src/services/searchAdapters/googleAdapter"
import { useBooksSearch } from "./src/hooks/useBooksSearch"
import { useNavigate } from "react-router-dom"
import { useClubSearch } from "./src/hooks/useClubSearch"
import { clubAdapter } from "./src/services/searchAdapters/clubAdapter"

export const Test = () => {
    const {search} = useBooksSearch()
    const {search: clubSearch} = useClubSearch()
    const navigate = useNavigate()

    return (
        <>
        <SearchBar1
            adapters={[googleAdapter(search, navigate), clubAdapter(clubSearch, navigate)]}
            iconPosition="start"
            collapse
            viewMore
            limit={5}
        />
        </>
    )
}