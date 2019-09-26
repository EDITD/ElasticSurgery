from flask import request


def get_request_data():
    return request.get_json()
