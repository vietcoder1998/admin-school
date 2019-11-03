// Create authozization header
export const createAuthozization = (username, password) => {
    let data = username + ":" + password;
    let buff = new Buffer(data);
    let base64data = buff.toString("base64");
    localStorage.setItem("cdcu", username);
    localStorage.setItem("wauthtk", base64data);
}

// Check invalid header
export const authHeaders = {
    "Access-Control-Allow-Headers": "*",
    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
}

// Check Login User
export const loginHeaders = (client_id?: string, secret?: string) => ({
    "client_id": client_id ? client_id : "test",
    "secret": secret ? secret : "test",
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json",
})
// No info header
export const noInfoHeader = {
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "application/json",
}

// Delete state when logout
export const deleteLoginState = () => {
    localStorage.setItem("wauthtk", null);
}

// Set accesstoken and refreshtoken


export const sendStringHeader = {
    "Access-Control-Allow-Headers": "*",
    "Content-Type": "text/plain",
    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
}

export const sendFileHeader = {
    "Access-Control-Allow-Headers": "*",
    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
}

// Set State of authenticate
export const setAuthSate = async (response) => {
    if (response.code === 200) {
        localStorage.setItem("userID", response.data.userID);
        localStorage.setItem("accessToken", response.data.accessToken);
    }
}

//Set Authorization