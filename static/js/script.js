// -- Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);

// -- Add tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// -- Add marker function
function addMarker(lat, lon, label) {
    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(label).openPopup();
}

// -- Draw line between two points
function drawLine(lat1, lon1, lat2, lon2) {
    L.polyline([[lat1, lon1], [lat2, lon2]], {
        color: 'red',
        weight: 3,
    }).addTo(map);
}

// -- Form submission logic
document.getElementById("addressForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const address = document.getElementById("address").value;
    const resultDiv = document.getElementById("result");
    const errorDiv = document.getElementById("error");

    resultDiv.style.display = "none";
    errorDiv.style.display = "none";

    try {
        const response = await fetch("/calculate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address }),
        });

        const data = await response.json();

        if (!response.ok || data.success === false) {
            errorDiv.innerHTML = `<p>${data.error}</p>`;
            errorDiv.style.display = "block";
        } else {
            const { latitude, longitude } = data.geocoded_address;
            const { turbine_id, distance_km, turbine_location } = data;

            // -- Update the results section
            resultDiv.innerHTML = `
                <p>Nearest Turbine: <strong>${turbine_id}</strong></p>
                <p>Distance: <strong>${distance_km}</strong> kilometers</p>
            `;
            resultDiv.style.display = "block";

            // -- Clear existing layers on the map
            map.eachLayer((layer) => {
                if (!layer._url) {
                    map.removeLayer(layer);
                }
            });

            // -- Center map to user's location
            map.setView([latitude, longitude], 12);

            // -- Add markers for the user location and turbine
            addMarker(latitude, longitude, `Address: ${address}`);
            addMarker(turbine_location.lat, turbine_location.lon, `Nearest Turbine: ${turbine_id}`);

            // -- Draw a line between the user's location and the turbine
            drawLine(latitude, longitude, turbine_location.lat, turbine_location.lon);
        }
    } catch (err) {
        console.error("Fetch failed:", err);
        errorDiv.innerHTML = `<p>Something went wrong. Please try again.</p>`;
        errorDiv.style.display = "block";
    }
});

// -- Modal Logic
document.getElementById("faqButton").addEventListener("click", () => {
    document.getElementById("faqModal").style.display = "block";
});

document.getElementById("closeFaq").addEventListener("click", () => {
    document.getElementById("faqModal").style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === document.getElementById("faqModal")) {
        document.getElementById("faqModal").style.display = "none";
    }
});

// -- Return to survey button
document.getElementById("returnToSurvey").addEventListener("click", () => {
    window.location.href = "https://docs.google.com/forms/d/e/1FAIpQLSdf2vF3HfEYnqo94qY4amWoBy1iPjP9cFF6zDT1n4vlXbW9vw/viewform";
});
