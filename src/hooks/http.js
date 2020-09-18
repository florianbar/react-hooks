import { useReducer, useCallback } from 'react';

const initialState = { 
    isLoading: false, 
    data: null,
    error: null,
    extra: null,
    identifier: null
};

const httpReducer = (httpState, action) => {
    switch (action.type) {
        case "SEND": 
            return { isLoading: true, error: null, data: null, extra: null, identifier: action.identifier };
        case "RESPONSE": 
            return { ...httpState, isLoading: false, data: action.data, extra: action.extra };
        case "ERROR": 
            return { isLoading: false, error: action.error };
        case "CLEAR": 
            return initialState;
        default:
            return httpState;
    }
};

const useHttp = () => {
    const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

    const clear = useCallback(() => dispatchHttp({ type: "CLEAR" }), []);

    const sendRequest = useCallback((url, method, body, requestExtra, identifier) => {
        dispatchHttp({ type: "SEND", identifier: identifier });

        fetch(url, { 
            method: method, 
            body: body,
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            return response.json();
        })
        .then(responseData => {
            dispatchHttp({ type: "RESPONSE", data: responseData, extra: requestExtra })
        })
        .catch(error => {
            dispatchHttp({ type: "ERROR", error: error.message });
        });
    }, []);

    return {
        isLoading: httpState.isLoading,
        data: httpState.data,
        error: httpState.error,
        sendRequest: sendRequest,
        requestExtra: httpState.extra,
        identifier: httpState.identifier,
        clear: clear
    };
};

export default useHttp;