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
    className?: string,
    fullWidth?: boolean,
    expanding?: boolean,
    select?: boolean
    targets: Target[],
    index?: number,
    results: UserBook[] | GoogleBook[],
    setResults: React.Dispatch<React.SetStateAction<UserBook[] | GoogleBook[]>>
}

export const SearchBar = ({className, fullWidth = false, expanding = false, targets=[], index, results=[], setResults}: SearchBarProps) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [focus, setFocus] = useState(false)
    const [open, setOpen] = useState(false)
    const [page, setPage] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const {search: bchSearch } = bchBooksClient()
    const {search: googleSearch} = googleBooksClient()

    const navigate = useNavigate()

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {    
        const term = e.target.value
        setSearchTerm(term)
    }

    const handleFocus = () => {
        setFocus(true)
    }

    const handleBlur = () => {
        setFocus(false)
        setSearchTerm("")
    }

    const handleOpen = () => {
        setTimeout(() => setOpen(true), 300)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const debouncedSearch = useCallback(debounce((searchFunc, params) => {
        searchFunc(params).then(res => setResults(
            res.results
            ? res.results
            : res.items
        ))
    }, 300), [searchTerm, bchSearch, googleSearch])

    useEffect(() => {
        if (searchTerm !== "")
            {
            if (targets.includes("bchbooks"))
            {
                debouncedSearch(bchSearch, searchTerm)}
            if (targets.includes("googleBooks")) 
            {
                debouncedSearch(googleSearch, {"intitle": searchTerm})
            }
            }
    }, [searchTerm])

    return (
        <Autocomplete
            clearOnEscape
            open={open}
            onOpen={handleOpen}
            onClose={handleClose}
            selectOnFocus
            clearOnBlur
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
                navigate(`books/${source}/${id}`)
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