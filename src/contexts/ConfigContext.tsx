import React from 'react'
import { IConfig } from '../models/config'

export interface IConfigContext {
   config: IConfig 
}

export const ConfigContext = React.createContext({
    config: {} as IConfig,
})

export default ConfigContext