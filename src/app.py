""
    # File:         app.py
    # Author:       Noah Rachel
    # Description:  Core functionality
""

# -- Imports
from flask import Flask, request, render_template, jsonify
from pandas import read_csv
from math import sqrt
from geopy.geocoders import Nominatim
from dotenv import load_dotenv
from pyproj import Transformer
from ssl import create_default_context
import certifi
import os
import errorHandler

# -- Load environment variables
env_path = os.path.join("/home/NoahR/turbineLocator", ".env")
load_dotenv(dotenv_path=env_path)

# -- Create Flask app
app = Flask(
    __name__,
    template_folder="../templates",  # HTML templates
    static_folder="../static"        # Static files (CSS, JS)
)

# -- Initialize geolocator with SSL context
geolocator = Nominatim(
    user_agent="turbine_distance_tool",
    ssl_context=create_default_context(cafile=certifi.where())
)

# Transformer for WGS84 to EPSG:27700 and back
wgs84_to_epsg27700 = Transformer.from_crs("epsg:4326", "epsg:27700", always_xy=True)
epsg27700_to_wgs84 = Transformer.from_crs("epsg:27700", "epsg:4326", always_xy=True)

# -- Load turbine data
def load_turbine_data():

    # -- Get data from env file
    tDataPath = os.getenv("TURBINE_DATA_FILEPATH")
    x_column = os.getenv("X_COORDINATE_COLUMN")
    y_column = os.getenv("Y_COORDINATE_COLUMN")
    id_column = os.getenv("TURBINE_ID_COLUMN")

    if not tDataPath:
        return errorHandler.handling(
            "An error occurred while loading the turbine data. Please try again.",
            "Environment variable 'TURBINE_DATA_FILEPATH' is missing or empty."
        )

    if not os.path.exists(tDataPath):
        return errorHandler.handling(
            "An error occurred while loading the turbine data. Please try again.",
            f"File does not exist at the provided path: {tDataPath}"
        )

    try:
        dataFile = read_csv(tDataPath, encoding="utf-8")
    except Exception as e:
        return errorHandler.handling(
            "An unexpected error occurred while loading turbine data. Please try again.",
            f"Error while reading turbine data file: {e}"
        )

    # Add WGS84 coordinates to the data
    dataFile["Longitude"], dataFile["Latitude"] = zip(*dataFile.apply(
        lambda row: epsg27700_to_wgs84.transform(row[x_column], row[y_column]), axis=1
    ))

    # -- Return data
    return dataFile.rename(columns={
        id_column: "Turbine_ID",
        x_column: "X_Coordinate",
        y_column: "Y_Coordinate"
    })

# -- Calculate Euclidean distance
def calculate_euclidean_distance(coord1, coord2):
    return sqrt((coord2[0] - coord1[0]) ** 2 + (coord2[1] - coord1[1]) ** 2)

# -- Find nearest turbine
def calculate_nearest_turbine(address_coords, turbine_data):
    results = []

    for _, row in turbine_data.iterrows():
        turbine_coords = (row["X_Coordinate"], row["Y_Coordinate"])
        distance = calculate_euclidean_distance(address_coords, turbine_coords)
        results.append((row["Turbine_ID"], distance))

    results.sort(key=lambda x: x[1])
    nearest_turbine = results[0]

    return nearest_turbine

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/calculate", methods=["POST"])
def calculate():

    # -- Handle address
    data = request.json
    address = data.get("address")
    if not address:
        return errorHandler.handling(
            "No address provided.",
            "User did not provide an address in the request.",
            400
        )

    # -- Geocode address
    try:
        location = geolocator.geocode(address)
        if not location or not location.latitude or not location.longitude:
            return errorHandler.handling(
                "That address could not be located. Please try simplifying it.",
                f"Geocoding failed.",
                400
            )
    except Exception as e:
        return errorHandler.handling(
            "An error occurred while locating your address. Please try again.",
            f"An unexpected error occurred while geocoding address. Error: {e}",
            500
        )

    # -- Transform geocoded address to EPSG:27700
    try:
        easting, northing = wgs84_to_epsg27700.transform(location.longitude, location.latitude)
        if not (easting and northing) or easting == float("inf") or northing == float("inf"):
            return errorHandler.handling(
                "An error occurred while handling that address. Please try again.",
                f"Coordinate transformation. Error: {e}",
                500
            )
        address_coords = (easting, northing)
    except Exception as e:
        return errorHandler.handling(
            "An error occurred while handling that address. Please try again.",
            f"Coordinate transformation error. Error: {e}",
            500
        )

    # -- Load turbine data
    turbine_data = load_turbine_data()
    if isinstance(turbine_data, str):
        return jsonify({"success": False, "error": turbine_data}), 400

    # -- Find the nearest turbine
    nearest_turbine = calculate_nearest_turbine(address_coords, turbine_data)
    turbine_id, distance = nearest_turbine

    # -- Get the WGS84 coordinates of the nearest turbine
    try:
        turbine_row = turbine_data.loc[turbine_data["Turbine_ID"] == turbine_id].iloc[0]
        turbine_lat, turbine_lon = turbine_row["Latitude"], turbine_row["Longitude"]
    except Exception as e:
        return errorHandler.handling(
            "An error occurred while handling the turbine data.",
            f"Could not get the turbine coordinates. Error: {e}",
            500
        )

    # Return the response
    return jsonify({
        "success": True,
        "distance_km": round(distance / 1000, 1),
        "geocoded_address": {
            "latitude": location.latitude,
            "longitude": location.longitude
        },
        "turbine_id": turbine_id,
        "turbine_location": {
            "lat": turbine_lat,
            "lon": turbine_lon
        }
    })
