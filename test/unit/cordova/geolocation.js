/*
 *  Copyright 2011 Research In Motion Limited.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
describe("Cordova Geolocation bridge", function () {
    var geo = require('ripple/geo'),
        event = require('ripple/event'),
        geolocation = require('ripple/platform/cordova/2.0.0/bridge/geolocation'),
        s,
        e,
        newpos = {
            latitude: 38.889438,
            longitude: 1.409005,
            altitude: 0,
            accuracy: 1,
            altitudeAccuracy: 1,
            heading: 0,
            speed: 0
        };


    beforeEach(function () {
        s = jasmine.createSpy("success");
        e = jasmine.createSpy("error");
        geo.timeout = false;
    });

    describe("on getLocation", function () {
        it("calls the success callback with valid position data", function () {
            geolocation.getLocation(s, e);
            expect(s).toHaveBeenCalledWith(jasmine.any(Object));
            expect(e).not.toHaveBeenCalled();

            var a = s.mostRecentCall.args[0];

            expect(a.latitude).toEqual(jasmine.any(Number));
            expect(a.longitude).toEqual(jasmine.any(Number));
            expect(a.altitude).toEqual(jasmine.any(Number));
            expect(a.accuracy).toEqual(jasmine.any(Number));
            expect(a.altitudeAccuracy).toEqual(jasmine.any(Number));
            expect(a.heading).toEqual(jasmine.any(Number));
            expect(a.speed).toEqual(jasmine.any(Number));
        });

        describe("when timing out", function () {
            beforeEach(function () {
                geo.timeout = true;
            });

            afterEach(function () {
                geo.timeout = false;
            });

            it("calls the fail callback on timeout", function () {
                var fail = jasmine.createSpy().andCallFake(function (error) {
                    expect(error.code).toBe("TIMEOUT");
                });

                geolocation.getLocation(s, fail);
                expect(fail).toHaveBeenCalled();
                expect(s).not.toHaveBeenCalled();
            });

            it("fails to fail when a timeout occurs and no error callback is specifed", function () {
                geolocation.getLocation(s);
                expect(s).not.toHaveBeenCalled();
            });
        });
    });

    xdescribe("on addWatch", function () {
        beforeEach(function () {
            geolocation = require('ripple/platform/cordova/2.0.0/bridge/geolocation');
        });

        describe("on PositionInfoUpdatedEvent", function () {
            it("updates the current position info and doesn't call again after the watch is cleared", function () {
                geolocation.addWatch(s, e, [0]);

                event.trigger("PositionInfoUpdatedEvent", [newpos], true);

                expect(s).toHaveBeenCalled();

                var s_args = s.mostRecentCall.args[0];
                expect(s_args.latitude).toBe(newpos.latitude);
                expect(s_args.longitude).toBe(newpos.longitude);
                expect(s_args.altitude).toBe(newpos.altitude);
                expect(s_args.accuracy).toBe(newpos.accuracy);
                expect(s_args.altitudeAccuracy).toBe(newpos.altitudeAccuracy);
                expect(s_args.heading).toBe(newpos.heading);
                expect(s_args.velocity).toBe(newpos.speed);

                expect(e).not.toHaveBeenCalled();

                s.reset();
                e.reset();

                geolocation.clearWatch(0);

                newpos = movePositionABit(newpos);

                event.trigger("PositionInfoUpdatedEvent", [newpos], true);

                expect(s).not.toHaveBeenCalled();
                expect(e).not.toHaveBeenCalled();

            });
        });

        describe("multiple watches", function () {
            it("can call multiple callbacks and removing selected ones is effective", function () {
                var mS = [], mE = [], i;
                for (i = 0; i < 5; i++) {
                    mS[i] = jasmine.createSpy("success" + i);
                    mE[i] = jasmine.createSpy("error" + i);
                }

                for (i = 0; i < mS.length; i++) {
                    geolocation.addWatch(mS[i], mE[i], [i]);
                }

                newpos = movePositionABit(newpos);
                event.trigger("PositionInfoUpdatedEvent", [newpos], true);

                for (i = 0; i < mS.length; i++) {
                    expect(mS[i]).toHaveBeenCalled();
                    expect(mE[i]).not.toHaveBeenCalled();
                }

                //reset spies
                for (i = 0; i < mS.length; i++) {
                    mS[i].reset();
                    mE[i].reset();
                }

                //remove odd numbered watches
                for (i = 0; i < mS.length; i++) {
                    if ((i % 2) !== 0)
                    { geolocation.clearWatch(i); }
                }

                newpos = movePositionABit(newpos);
                event.trigger("PositionInfoUpdatedEvent", [newpos], true);

                for (i = 0; i < mS.length; i++) {
                    if ((i % 2) === 0) {
                        expect(mS[i]).toHaveBeenCalled();
                        expect(mE[i]).not.toHaveBeenCalled();
                    }
                    else {
                        expect(mS[i]).not.toHaveBeenCalled();
                        expect(mE[i]).not.toHaveBeenCalled();
                    }
                }
            });
        });
    });

    function movePositionABit(pos) {
        return {
            latitude: pos.latitude + 0.003,
            longitude: pos.longitude + 0.004,
            altitude: pos.altitude,
            accuracy: pos.accuracy,
            altitudeAccuracy: pos.altitudeAccuracy,
            heading: pos.heading,
            speed: pos.speed
        };
    }
});