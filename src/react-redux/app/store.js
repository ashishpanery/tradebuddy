import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './root-reducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
const middleware=[];
const persistConfig = {
    key: 'root',
    storage,
  }
  const persistedReducer = persistReducer(persistConfig, rootReducer)
// export const store=createStore(
//     rootReducer,
//     composeWithDevTools(
//         applyMiddleware(...middleware)
//       )
//     );
    // export default () => {
    //     let store = createStore(persistedReducer)
    //     let persistor = persistStore(store)
    //     return { store, persistor }
    //   }

    export let store = createStore(persistedReducer, composeWithDevTools(applyMiddleware(...middleware)));
    export let persistor = persistStore(store);
