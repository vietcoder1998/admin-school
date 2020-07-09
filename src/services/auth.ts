// Check invalid header

export const authHeaders = {
    "Access-Control-Allow-Headers": "*",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
};

// Check Login User
export const loginHeaders = (client_id: string | undefined, secret: string | undefined) => ({
    "client_id": client_id,
    "secret": secret,
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json",
});

// No info header
export const noInfoHeader = {
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json",
};

// Delete state when logout
export const deleteLoginState = () => {
    localStorage.setItem("wauthtk", '');
};

// Set access token and refresh token
export const sendStringHeader = {
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "text/plain",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
};

export const sendFileHeader = {
    "Access-Control-Allow-Headers": "*",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
};

// Set State of authenticate
export const setAuthSate = async (response: any) => {
    if (response.code === 200) {
        localStorage.setItem("userID", response.data.userID);
        localStorage.setItem("token", response.data.token);
    }
};

// Send Image file
export const sendImageHeader = {
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "multipart/form-data",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
};