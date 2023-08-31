import React from 'react'
const GlobalContext = React.createContext({
    tags: new Set(),
    setTags: () => {}
})

export default GlobalContext