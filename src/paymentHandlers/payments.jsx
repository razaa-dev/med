import Swal from "sweetalert2";
import { APIURLS, NAMES } from "../components/Constants";
import { getUserData } from "../components/Helper";
import { useEffect } from "react";
// import useWalletStore from "../hooks/useWalletStore";
// import { useEffect } from "react";

const token = localStorage.getItem('token');
const userData = getUserData();

// export const usePayment = () => {
//     const { walletBalance, addToWalletBalance } = useWalletStore();

//     const handlePayStack = async (amountInNaira) => {
//         if (!amountInNaira || parseFloat(amountInNaira) <= 0) {
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Invalid Amount',
//                 text: 'Please enter a valid amount.',
//             });
//             return;
//         }
//         const amountInKobo = amountInNaira * 100;

//         const paymentData = {
//             amount: Math.round(amountInKobo), 
//             currency: NAMES.currency || 'NGN',
//             email: userData?.data?.email,
//         };

//         try {
//             const response = await fetch(APIURLS.APIURLPATIENTSPAY, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`,
//                 },
//                 body: JSON.stringify(paymentData),
//             });

//             if (!response.ok) {
//                 const errorText = await response.text();
//                 throw new Error(`Error initiating payment: ${errorText}`);
//             }

//             const responseData = await response.json();
//             const { authorization_url, reference } = responseData.data.data;

//             Swal.fire({
//                 icon: 'info',
//                 title: 'Payment Initiated',
//                 html: `
//                     <strong>Email:</strong> ${paymentData.email}<br>
//                     <strong>Amount:</strong> ${NAMES.NairaSymbol}${amountInNaira}<br>
//                     <strong>Currency:</strong> ${paymentData.currency}<br>
//                     <strong>Authorization URL:</strong> <a href="${authorization_url}" target="_blank">${authorization_url}</a><br>
//                     <strong>Reference:</strong> ${reference}
//                 `,
//                 confirmButtonText: 'Proceed to Pay',
//             });

//             window.location.href = authorization_url; // Redirect to Paystack for payment
//         } catch (error) {
//             console.error('Error initializing payment:', error);

//             Swal.fire({
//                 icon: 'error',
//                 title: 'Payment Initialization Failed',
//                 text: `An error occurred: ${error.message}`,
//             });
//         }
//     };

//     useEffect(() => {
//         const handlePaymentVerification = async () => {
//             const urlParams = new URLSearchParams(window.location.search);
//             const reference = urlParams.get('reference');

//             if (reference) {
//                 try {
//                     const verifyResponse = await fetch(`https://api.digitalhospital.com.ng/api/v1/pay/verify?reference=${reference}`, {
//                         method: 'GET',
//                         headers: {
//                             'Authorization': `Bearer ${token}`,
//                         },
//                     });

//                     if (!verifyResponse.ok) {
//                         throw new Error(`Error verifying payment: ${verifyResponse.statusText}`);
//                     }

//                     const verifyData = await verifyResponse.json();

//                     if (verifyData.status === 'success') {
//                         Swal.fire({
//                             icon: 'success',
//                             title: 'Payment Successful',
//                             text: `Payment for ${verifyData.data.amount / 100} was successful.`,
//                         });

//                         addToWalletBalance(verifyData.data.amount / 100); // Update wallet balance
//                         setTimeout(() => {
//                             window.location.href = '/wallet'; // Redirect to /wallet
//                         }, 2000); // Redirect after 2 seconds
//                     } else {
//                         Swal.fire({
//                             icon: 'error',
//                             title: 'Payment Verification Failed',
//                             text: 'Unable to verify the payment. Please try again.',
//                         });
//                     }
//                 } catch (error) {
//                     console.error('Error verifying payment:', error);

//                     Swal.fire({
//                         icon: 'error',
//                         title: 'Payment Verification Failed',
//                         text: `An error occurred: ${error.message}`,
//                     });
//                 }
//             }
//         };

//         handlePaymentVerification();
//     }, [walletBalance]);

//     return {
//         handlePayStack
//     };
// };


export const handlePayStack = async (amountInNaira) => {
    if (!amountInNaira || parseFloat(amountInNaira) <= 0.0) {
        Swal.fire({
            icon: "warning",
            title: "Invalid Amount",
            text: "Please enter a valid amount.",
        });
        return;
    }

    const amountInKobo = amountInNaira * 100;

    const paymentData = {
        amount: Math.round(amountInKobo),
        currency: NAMES.currency || "NGN",
        email: userData?.data?.email,
    };

    try {
        const response = await fetch(APIURLS.APIURLPATIENTSPAY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(paymentData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error initiating payment: ${errorText}`);
        }

        const responseData = await response.json();
        const { authorization_url, reference } = responseData?.data?.data || {};

        if (authorization_url && reference) {
            localStorage.setItem("payment_reference", reference);

            Swal.fire({
                icon: "info",
                title: "Payment Initiated",
                html: `
                    <strong>Email:</strong> ${paymentData.email}<br>
                    <strong>Amount:</strong> ${NAMES.NairaSymbol}${amountInNaira}<br>
                    <strong>Currency:</strong> ${paymentData.currency}<br>
                    <strong>Authorization URL:</strong> <a href="${authorization_url}" target="_blank">${authorization_url}</a><br>
                    <strong>Reference:</strong> ${reference}
                `,
                confirmButtonText: "Proceed to Pay",
            });

            window.location.href = authorization_url;
        } else {
            Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text: "Failed to initiate payment.",
            });
        }
    } catch (error) {
        console.error("Error initializing payment:", error);
        Swal.fire({
            icon: "error",
            title: "Payment Initialization Failed",
            text: `An error occurred: ${error.message}`,
        });
    }
};

const verifyUserReferencePayment = async (reference) => {
    try {
        const response = await fetch(`${APIURLS.APIURLPATIENTSPAY}/verify?reference=${reference}`);
        const responseData = await response.json();
        const { payment_status, amount, message } = responseData?.data?.data || {};

        if (payment_status === "success") {
            const newBalance = amount / 100;
            const userData = JSON.parse(localStorage.getItem("user_data")) || {};
            userData.data = { ...userData.data, acctbal: newBalance };
            localStorage.setItem("user_data", JSON.stringify(userData));

            Swal.fire({
                icon: "success",
                title: "Payment Successful",
                text: message,
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Payment Failed",
                text: message,
            });
        }
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Payment Verification Failed",
            text: `An error occurred: ${error.message}`,
        });
    }
};

useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get("reference");
    if (reference) verifyUserReferencePayment(reference);
}, []);

useEffect(() => {
    const handleWindowClose = () => {
        const reference = localStorage.getItem("payment_reference");
        if (reference) verifyUserReferencePayment(reference);
    };
    window.addEventListener("beforeunload", handleWindowClose);
    return () => window.removeEventListener("beforeunload", handleWindowClose);
}, []);

useEffect(() => {
    const onStorageChange = () => {
        const updatedUserData = JSON.parse(localStorage.getItem("user_data"));
        if (updatedUserData?.data?.acctbal) {
            updatedUserData.data.acctbal = updatedUserData.data.acctbal;
        }
    };

    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
}, []);