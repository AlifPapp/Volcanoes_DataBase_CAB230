export function SetBaseEndpoint(baseEndpoint) {
    localStorage.setItem('baseEndpoint', baseEndpoint);
}

export function RemoveBaseEndpoint() {
    localStorage.removeItem('baseEndpoint');
}

export function GetBaseEndpoint() {
    var baseEndpoint = localStorage.getItem('baseEndpoint');
    if (!baseEndpoint) {
        baseEndpoint = "http://4.237.58.241:3000";
        SetBaseEndpoint(baseEndpoint);
    }
    return baseEndpoint;
}

export async function CheckBaseEndpoint(baseEndpoint) {
    try {
        var response = await fetch(baseEndpoint + '/countries');

        if (response.status !== 200) {
            return [false, 'Failed to fetch countries']
        }
        var data = await response.json();
        if (!Array.isArray(data)) {
            return [false, 'Invalid response data type'];
        }
        if (data.length < 1) {
            return [false, 'No countries found'];
        }
    } catch (error) {
        return false
    }
    SetBaseEndpoint(baseEndpoint);
    return true
}