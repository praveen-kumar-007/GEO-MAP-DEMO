export function calculateDistance(coords){
    let total = 0;
    for(let i = 0; i < coords.length -1; i++){
        const [lat1, lon1] = coords[i];
        const [lat2, lon2] = coords[i+1];
        total += haversineDistance(lat1, lon1, lat2, lon2);

    }
    return parseFloat(total.toFixed(2));
}


function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}


export function calculateArea(coords) {
    let area = 0;
    const n = coords.length;
    for(let i = 0; i < n; i++){
        const [x1, y1] = coords[i];
        const [x2, y2] = coords[(i + 1) % n];
        area += (x1 * y2 - x2 * y1);
    }
    return parseFloat((Math.abs(area) / 2).toFixed(2));
}