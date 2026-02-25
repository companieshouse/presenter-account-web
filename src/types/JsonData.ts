type JSONValue =
    | string
    | number
    | boolean

    | JSONObject

    | JSONArray;

interface JSONArray extends Array<JSONValue> {} // eslint-disable-line

export interface JSONObject {
    [x: string]: JSONValue;
}
