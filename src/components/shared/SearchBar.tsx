import { Search } from "@mui/icons-material"
import { Autocomplete, IconButton, InputAdornment, TextField } from "@mui/material"
import debounce from "lodash.debounce"
import { useCallback, useEffect, useRef, useState } from "react"
import { bchBooksClient } from "../../api/bchBooksClient"
import { googleBooksClient } from "../../api/googleBooksClient"
import { colors } from "../../styles/colors"
import { useNavigate } from "react-router-dom"

type Target = "googleBooks" | "bchbooks"

type SearchBarProps = {
    close?: boolean,
    className?: string,
    fullWidth?: boolean,
    expanding?: boolean,
    select?: boolean
    targets: Target[],
    page?: number,
    setPage?: React.Dispatch<React.SetStateAction<number>>,
    results: UserBook[] | GoogleBook[],
    setResults: React.Dispatch<React.SetStateAction<T[]>> | ((res: T[]) => void),
    setTotal: React.Dispatch<React.SetStateAction<number>>
}

export const SearchBar = ({close=false, className, fullWidth = false, expanding = false, targets=[], page=0, setPage, results=[], setResults, setTotal}:SearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [focus, setFocus] = useState(false)
    const [open, setOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null);

    const {search: bchSearch } = bchBooksClient()
    const {search: googleSearch} = googleBooksClient()

    const navigate = useNavigate()

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {    
        const term = e.target.value
        setSearchTerm(term)
        setPage(0)
    }

    const handleFocus = () => {
        setFocus(true)
    }

    const handleBlur = () => {
        setFocus(false)
    }

    const handleOpen = () => {
        setTimeout(() => setOpen(true), 300)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const debouncedSearch = useCallback(debounce((searchFunc, params) => {
        searchFunc(...params).then(res => {setResults(
            res.results
            ? res.results
            : res.items
        )
        setTotal(
            "totalItems" in res
            ? res.totalItems > 1000
                ? 100
                : res.totalItems
            : res.total
        )}
    )
    }, 300), [searchTerm, page, bchSearch, googleSearch])

    useEffect(() => {
        if (searchTerm !== "")
            {
            if (targets.includes("bchbooks"))
            {
                debouncedSearch(bchSearch, [searchTerm, page] )}
            if (targets.includes("googleBooks")) 
            {
                debouncedSearch(googleSearch, [{"intitle": searchTerm}, page])
            }
            setPage(0)
            }
    }, [searchTerm])

    useEffect(() => {
        if (searchTerm !== "")
        {
            if (targets.includes("bchbooks"))
            {
                bchSearch(searchTerm, page).then(res => {
                    setResults(res.results)
                    setTotal(res.total)
                })
            }
            if (targets.includes("googleBooks"))
            {
                googleSearch({"intitle": searchTerm}, page).then(res => {
                    setResults(res.items)
                    setTotal(
                        res.totalItems > 1000
                        ? 100
                        : res.totalItems
                    )
                })
            }
        }
    },[page])

    return (
        <Autocomplete
            clearOnEscape
            open={close? false : open}
            onOpen={handleOpen}
            onClose={handleClose}
            selectOnFocus
            filterOptions={(x) => x}
            className="self-center"
            getOptionLabel={(option: UserBook | GoogleBook | string) => {
                if (typeof option === 'string') return option
                if ("title" in option) return option.title
                if ("volumeInfo" in option)return option.volumeInfo.title
                return ""
            }}
            options={results}
            freeSolo
            onInputChange={(_, value) => {
                value !== "" && setSearchTerm(value)
            }}
            onChange={(_, value) => {
                let id
                let source
                if (value) {
                    if (typeof value === "string") {
                        return
                    } 
                    else if ("title" in value) {
                        id = value.id
                        source = "bch"
                    }
                    else if ("volumeInfo" in value) {
                        id = value.id
                        source = "google"
                    }
                navigate(`/books/${source}/${id}`)
                }

            }}
            getOptionKey={(option) => {
                if (typeof option === 'string') return option
                else {return option.id}
            }}
            renderInput={(params) => (
        <TextField 
                {...params}
            fullWidth={fullWidth}
            inputRef={inputRef}
            className={`
                text-white
                ${className} 
                transition-all
                duration-300
                ${fullWidth
                ? ""
                : expanding 
                    ? focus                     
                        ? "w-[200px]"
                        : "w-[60px]"
                    : "w-[200px]"
            }`
            }
            slotProps={{
                input: {
                    ...params.InputProps,
                    endAdornment: (
                        <>
                        <InputAdornment position="end">
                            <IconButton 
                                disableRipple
                                disableFocusRipple
                                tabIndex={-1}
                                onClick={() => {
                                    inputRef.current?.focus()
                                    !open && handleOpen()                                
                                }}
                                >
                                <Search sx={{
                                    color: colors.input.main,
                                }} />
                            </IconButton>
                        </InputAdornment>
                        </>
                    ),
                    className: `rounded-full p-0`,
                },
                
            }}
            sx={{
                "& .MuiOutlinedInput-root": {
                borderRadius: "999px",
                "& fieldset": {
                    borderColor: "white",
                },
                "&:hover fieldset": {
                    borderColor: "gray", // hover color
                },
                "&.Mui-focused fieldset": {
                    borderColor: "white", // focused color
                },

            }
            }}
            size="small"
            onFocus={handleFocus}
            onBlur={handleBlur}
            />
            )}

            />
    )
}