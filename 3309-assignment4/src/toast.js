import { toast, ToastContainer } from 'react-toastify';


function toastError(e) {
    toast.error(e, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}


function showError(e) {
    try {
        let errors = JSON.parse(e).errors;
        for (let error of errors){
            toastError(error);
        }

    }
    catch {
        toastError(e);
    }
}

function ErrorContainer() {
    return (
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        ></ToastContainer>
    )
}


function toastSuccess(e) {
    toast.success(e, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
}


function showSuccess(e) {
    try {
        let errors = JSON.parse(e).errors;
        for (let error of errors){
            toastSuccess(error);
        }

    }
    catch {
        toastSuccess(e);
    }
}

function SuccessContainer() {
    return (
        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        ></ToastContainer>
    )
}


export { showError, ErrorContainer, showSuccess, SuccessContainer };
