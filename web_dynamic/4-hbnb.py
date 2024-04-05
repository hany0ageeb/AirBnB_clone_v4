#!/usr/bin/python3
""" Starts a Flash Web Application """
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template, request, jsonify
import uuid
app = Flask(__name__, template_folder='templates')
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/4-hbnb', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """
    states = storage.all(State).values()
    states = sorted(states, key=lambda k: k.name)
    st_ct = []

    for state in states:
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])

    amenities = storage.all(Amenity).values()
    amenities = sorted(amenities, key=lambda k: k.name)

    places = storage.all(Place).values()
    places = sorted(places, key=lambda k: k.name)

    return render_template('4-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places,
                           cache_id=str(uuid.uuid4()))

@app.route(
        '/places_search',
        methods=['POST'],
        strict_slashes=False)
def search_places():
    """
    POST /api/v1/places_search that retrieves all Place objects depending
    of the JSON in the body of the request.
    """
    json_data = request.get_json(silent=True)
    if json_data is None:
        abort(400, 'Not a JSON')
    states_ids = set(json_data.get('states', []))
    cities_ids = set(json_data.get('cities', []))
    amenities_ids = set(json_data.get('amenities', []))
    if states_ids:
        states_cities = [
                city.id
                for city in storage.all(City).values()
                if city.state_id in states_ids]
        cities_ids.update(states_cities)
    if cities_ids:
        places = [
                place
                for place in storage.all(Place).values()
                if place.city_id in cities_ids]
    else:
        places = storage.all(Place).values()
    if amenities_ids:
        places = [
                place
                for place in places
                if amenities_ids.issubset(set(place.amenity_ids))]
    return jsonify([place.to_dict() for place in places]), 200


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)
