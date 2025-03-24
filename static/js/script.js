/* General Styles */
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #333;
    color: white;
    position: sticky;
    top: 0;
    z-index: 1000;
}

.nav-button {
    background-color: #444;
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 14px;
}

.nav-button:hover {
    background-color: #555;
}

main {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
}

#error {
    color: red;
    display: none;
    margin-top: 10px;
}

#result {
    display: none;
    margin-top: 10px;
    background-color: #fff;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#map {
    height: 300px;
    width: 100%;
    margin-top: 20px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Input Box Styles */
form {
    background-color: #fff;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
}

form label {
    display: block;
    font-size: 14px;
    margin-bottom: 5px;
    color: #555;
}

form input[type="text"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    margin-bottom: 10px;
    box-sizing: border-box;
}

form button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 14px;
}

form button:hover {
    background-color: #218838;
}

/* Modal Styles */
.modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1000; /* Ensure it's on top of everything */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scrolling if needed */
    background-color: rgba(0, 0, 0, 0.8); /* Black background with opacity */
}

.modal-content {
    background-color: white;
    margin: 15% auto; /* Centered */
    padding: 20px;
    border-radius: 8px;
    width: 80%; /* Adjust width as needed */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Subtle shadow */
    color: #333; /* Text color */
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    margin-left: 20px;
    cursor: pointer;
}

.close:hover, .close:focus {
    color: black;
    text-decoration: none;
}

.modal h2 {
    margin-top: 0;
    font-size: 24px;
}

.modal p {
    font-size: 16px;
    line-height: 1.5;
}

/* Add fade-in effect */
.modal-content {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.9);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}
