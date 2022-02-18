import React from 'react';
import { hydrate, render } from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { store } from './react-redux/app/store';
import { persistor } from './react-redux/app/store';
// import { ErrorBoundary } from 'react-error-boundary';
// import Error from "./pages/Error"

// const errorHandler = (error, errorInfo) => {
//   console.log({ error })
//   console.log({ errorInfo })
// }

// ReactDOM.render(
//   <React.Suspense fallback={<h1>Falling back</h1>}>
//     <Provider store={store}>
//       <PersistGate loading={null} persistor={persistor}>
//         {/* <ErrorBoundary FallbackComponent={Error} onError={errorHandler}> */}
//         <App />
//         {/* </ErrorBoundary> */}
//       </PersistGate>
//     </Provider>
//   </React.Suspense>,

//   document.getElementById('root')
// );

const renderApp = (
  <React.Suspense fallback={<h1>Falling back</h1>}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <ErrorBoundary FallbackComponent={Error} onError={errorHandler}> */}
        <App />
        {/* </ErrorBoundary> */}
      </PersistGate>
    </Provider>
  </React.Suspense>
)

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(renderApp, rootElement);
}
else {
  render(renderApp, rootElement)
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
