async function main() {

    // Fetch data on all earthquakes from the past 7 days
    const response = await fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson");
    const data = await response.json();
    const features = data.features

    earthqMarkers = []

    function color(value) {

        dep_color = ''

        if (value <= 20) {
            dep_color = "#edf8e9"
        }

        if (value > 20 && value <= 40) {
            dep_color = "#c7e9c0"

        }

        if (value > 40 && value <= 60) {
            dep_color = "#a1d99b"

        }

        if (value > 60 && value <= 80) {
            dep_color = '#74c476'

        }

        if (value > 80 && value <= 100) {
            dep_color = "#31a354"

        }

        if (value > 100) {
            dep_color = "#006d2c"

        }

        return dep_color

    }

    for (i = 0; i < features.length; i++) {

        // Pull out the location and depth of the earthquake 

        let lon = features[i].geometry.coordinates[0]
        let lat = features[i].geometry.coordinates[1]
        let dep = features[i].geometry.coordinates[2]

        // Pull out info on the magnitude of the earthquake

        let mag = features[i].properties.mag

        // pull out the title of the event

        let title = features[i].properties.title

        earthqMarkers.push(L.circle([lat, lon], {
            "radius": mag * 20000,
            "fillColor": color(dep),
            "fillOpacity": 1

        }).bindPopup(`<h1>${title}</h1> <hr> <h3>Magnitude: ${mag}</h3> <hr> <h3>Depth: ${dep}</h3> <hr> <h3>Latitude, Longtitude: ${lat}, ${lon}</h3>`)
        )
    }

    earthqLayer = L.layerGroup(earthqMarkers);

    // create basemap object
    var myMap = L.map("map", {
        center: [37, -100],
        zoom: 4,
        layers: [earthqLayer]
    });

    // Adding the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    // add in the legend

    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {

        let div = L.DomUtil.create("div", "info legend");

        const depths = [0, 20, 40, 60, 80, 100];
        const colors = [
            "#edf8e9",
            "#c7e9c0",
            "#a1d99b",
            "#74c476",
            "#31a354",
            "#006d2c",
        ];

        // Looping through our intervals to generate a label with a colored square for each interval.
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                "<i style='background: " + colors[i] + "'></i> " +
                depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
        }
        return div;
    };

    legend.addTo(myMap);
}

main()

