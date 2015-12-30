/**
 * Created by Jonatan on 28/12/2015.
 */

var eventService = function ($http, googleMapsService) {
    "use strict";

    //private

    //public
    return {
        getEventById : function (eventid, cb) {
            $http.get("/api/event/" + eventid).success(function (data) {
                if(data.redirect) {
                    cb(null, data);
                } else {
                    if(data.address) {
                        cb(null, new GfEvent(data._id, data.eventname, data.eventimage, data.authorid, data.from, data.until, data.lat, data.lng, data.address));
                    } else {
                        googleMapsService.convertCoordinatesToAdress(data.lat, data.lng, function(err, address) {
                            if(!err) {
                                cb(null, cb(null, new GfEvent(data._id, data.eventname, data.eventimage, data.authorid, new Date(data.from), new Date(data.until), data.lat, data.lng, address)));
                            } else {
                                cb(err, null);
                            }
                        });
                    }
                }
            }).error(function (error) {
                cb(error, null);
            });
        },

        postEvent : function(data, cb) {
            googleMapsService.convertAdressToCoordinates(data.address, function(err, coord) {
                if(!err) {
                    data.lat = coord.lat();
                    data.lng = coord.lng();

                    $http.post("/api/event", new GfEvent(data._id, data.eventname, data.eventimage, data.authorid, new Date(data.from), new Date(data.until), data.lat, data.lng, data.address)).success(function(response) {
                        cb(null, response)
                    }).error(function(error) {
                        cb(error, null);
                    });
                } else {
                    cb(err, null);
                }
            });
        }
    };
};

angular.module("geofeelings").factory("eventService", ["$http", "googleMapsService", eventService]);