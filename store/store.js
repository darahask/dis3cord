import {configureStore} from '@reduxjs/toolkit'
import userDaoReducer from './reducers/userdaoreducer'
import thunk from 'redux-thunk'

export default configureStore({
    reducer: {
        userDaos: userDaoReducer,
    },
    middleware: [thunk]
})