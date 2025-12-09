import type { SearchParams } from "../components/library/Library"
const url = "https://www.googleapis.com/books/v1/volumes"
const key = import.meta.env.VITE_GOOGLE_BOOK_KEY

const search = async (searchParams: SearchParams, page: number=1) => {
    let query = ""
    Object.entries(searchParams).forEach(param => query += `${param[0]}:${param[1]}+`)
    query = query.slice(0,-1)
    query += `&startIndex=${String(page)}&key=${key}`
    const response = await fetch(`${url}?q=${query}`).then(res => res.json())

    return response
}

export const googleBooksClient = () => {
    return {search}
}