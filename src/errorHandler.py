"" 
  # File:         errorHandler.py
  # Author:       Noah Rachel
  # Description:  Handle logging of errors
""

# -- Imports
import datetime
from flask import jsonify

# -- Handle writing the data to a .log file
def logging(data):
    with open("error_log.log", "a") as log_file:
        log_file.write(f"{datetime.datetime.now()} || {data}\n")


# -- Handle exiting program and log errors
def handling (
        public_comment = "An error has occured.", 
        log_comment = "No comment provided",
        status_code = 500):
    
    # [Var = Use, Default]
    # public_comment = Comment to display to the user, Auto Comment
    # log_comment = Comment to be logged to file, Auto Comment
    # status_code = HTTP status code, 500
    
    # -- Log error to file
    logging(f" {public_comment} || {log_comment}")
    
    # -- Display user comment
    # Return the error as a JSON response to the client
    return jsonify({"success": False, "error": public_comment}), status_code