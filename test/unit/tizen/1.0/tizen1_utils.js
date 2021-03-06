/*
 *  Copyright 2012 Intel Corporation.
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

describe("tizen_1.0_tizen1_utils", function () {
    var tutils = require('ripple/platform/tizen/1.0/tizen1_utils');

    it("MatchAttributeFilter", function () {
        var ret, phones = [],
            b1 = ["red", "yellow"], b2 = ["yellow", "green"], b3 = ["white", "green"],
            Brand = function (_color) {
                return {
                    color: _color.slice(0)
                };
            },
            Phone = function (_name, _color) {
                return {
                    name: _name,
                    brand: new Brand(_color)
                };
            },

            dataArray = [{
                firstName: "Arron",
                age: 18
            },
            {
                firstName: "Baron",
                age: 20
            },
            {
                firstName: "Carson",
                age: 22
            }],
            dataSet = {
                e1: {
                    firstName: "Alicia",
                    lastName: "Last",
                    age: 8
                },
                e2: {
                    firstName: "Bianca",
                    lastName: null,
                    age: 9
                },
                e3: {
                    firstName: "Celilia",
                    age: 10
                }
            };

        phones.push(new Phone("b1", b1));
        phones.push(new Phone("b2", b2));
        phones.push(new Phone("b3", b3));

        ret = tutils.matchAttributeArrayFilter(phones, "brand.color", "CONTAINS", "RED");
        expect(ret.length).toEqual(1);
        expect(ret[0].name).toEqual("b1");
        ret = tutils.matchAttributeArrayFilter(phones, "brand.color", "EXACTLY", "yellow");
        expect(ret.length).toEqual(2);
        expect(ret[0].name).toEqual("b1");
        expect(ret[1].name).toEqual("b2");

        ret = tutils.matchAttributeFilter(dataArray, "firstName", "EXACTLY", "arron");
        expect(ret.length).toEqual(0);
        ret = tutils.matchAttributeFilter(dataArray, "firstName", "FULLSTRING", "arron");
        expect(ret.length).toEqual(1);
        expect(ret[0].firstName).toEqual("Arron");
        ret = tutils.matchAttributeFilter(dataSet, "firstName", "CONTAINS", "li");
        expect(ret.length).toEqual(2);
        expect(ret[0].firstName).toEqual("Alicia");
        expect(ret[1].firstName).toEqual("Celilia");
        ret = tutils.matchAttributeFilter(dataSet, "firstName", "STARTSWITH", "a");
        expect(ret.length).toEqual(1);
        ret = tutils.matchAttributeFilter(dataArray, "firstName", "ENDSWITH", "ON");
        expect(ret.length).toEqual(3);
        ret = tutils.matchAttributeFilter(dataSet, "lastName", "EXISTS");
        expect(ret.length).toEqual(2);
    });

});
