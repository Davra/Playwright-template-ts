import type { APIRequestContext } from "@playwright/test";
import type {
  Device,
  Rule,
  RequestOptionsNoBody,
  RequestOptionsWithBody,
  ResponseFromTSDB,
  Twin,
  TwinType,
  User,
  Role,
} from "../types";
import { APIResponse } from "@playwright/test";

export default class platformCRUD {
  private readonly request: APIRequestContext;

  constructor(adminContext: APIRequestContext) {
    this.request = adminContext;
  }

  private get: CrudRequest = async (url, options = {}) => {
    return await this.request.get(url, { failOnStatusCode: !options.rawResponse, ...options });
  };

  private post: CrudRequest = async (url, options = {}) => {
    return await this.request.post(url, { failOnStatusCode: !options.rawResponse, ...options });
  };

  private put: CrudRequest = async (url, options = {}) => {
    return await this.request.put(url, { failOnStatusCode: !options.rawResponse, ...options });
  };

  private delete: CrudRequest = async (url, options = {}) => {
    return await this.request.delete(url, { failOnStatusCode: !options.rawResponse, ...options });
  };

  // -----------------------
  //         DEVICES
  // -----------------------

  getDevices: AsyncGetFn<Device[]> = async (options = {}) => {
    const response = await this.get("/api/v1/devices", options);
    return options.rawResponse ? response : (await response.json()).records;
  };

  getDevice: AsyncGetFnWithParam<Device> = async (uuid, options = {}) => {
    const response = await this.get(`/api/v1/devices/${uuid}`, options);
    return options.rawResponse ? response : (await response.json()).records[0];
  };

  createDevice: AsyncPostFn<object, Device> = async (payload, options = {}) => {
    const response = await this.post("/api/v1/devices", { data: payload, ...options });
    return options.rawResponse ? response : (await response.json())[0];
  };

  updateDevice: AsyncPutFn = async (uuid, payload, options = {}) => {
    return await this.put(`/api/v1/devices/${uuid}`, { data: payload, ...options });
  };

  deleteDevice: AsyncDeleteFn = async (uuid, options = {}) => {
    return await this.delete(`/api/v1/devices/${uuid}`, options);
  };

  // -----------------------
  //     RULES ENGINE
  // -----------------------

  getRules: AsyncGetFn<Rule[]> = async (options = {}) => {
    const response = await this.get("/api/v2/rules", options);
    return options.rawResponse ? response : (await response.json()).records;
  };

  getRule: AsyncGetFnWithParam<Rule> = async (uuid, options = {}) => {
    const response = await this.get(`/api/v2/rules/${uuid}`, options);
    return options.rawResponse ? response : await response.json();
  };

  createRule: AsyncPostFn<object, Rule> = async (payload, options = {}) => {
    const response = await this.post("/api/v2/rules", { data: payload, ...options });
    return options.rawResponse ? response : await response.json();
  };

  updateRule: AsyncPutFn = async (uuid, payload, options = {}) => {
    return await this.put(`/api/v2/rules/${uuid}`, { data: payload, ...options });
  };

  deleteRule: AsyncDeleteFn = async (uuid, options = {}) => {
    return await this.delete(`/api/v2/rules/${uuid}`, options);
  };

  // -----------------------
  //      DIGITAL TWINS
  // -----------------------

  getTwins: AsyncGetFn<Twin[]> = async (options = {}) => {
    const response = await this.get("/api/v1/twins", options);
    return options.rawResponse ? response : await response.json();
  };

  getTwin: AsyncGetFnWithParam<Twin> = async (uuid, options = {}) => {
    const response = await this.get(`/api/v1/twins/${uuid}`, options);
    return options.rawResponse ? response : await response.json();
  };

  createTwin: AsyncPostFn<object, Twin> = async (payload, options = {}) => {
    const response = await this.post("/api/v1/twins", { data: payload, ...options });
    return options.rawResponse ? response : await response.json();
  };

  updateTwin: AsyncPutFn = async (uuid, payload, options = {}) => {
    return await this.put(`/api/v1/twins/${uuid}`, { data: payload, ...options });
  };

  deleteTwin: AsyncDeleteFn = async (uuid, options = {}) => {
    return await this.delete(`/api/v1/twins/${uuid}`, options);
  };

  getTwinType: AsyncGetFnWithParam<TwinType> = async (uuid, options = {}) => {
    const response = await this.get(`/api/v1/twintypes/${uuid}`, options);
    return options.rawResponse ? response : await response.json();
  };

  getTwinTypes: AsyncGetFn<TwinType[]> = async (options = {}) => {
    const response = await this.get("/api/v1/twintypes", options);
    return options.rawResponse ? response : await response.json();
  };

  createTwinType: AsyncPostFn<object, TwinType> = async (payload, options = {}) => {
    const response = await this.post("/api/v1/twintypes", { data: payload, ...options });
    return options.rawResponse ? response : await response.json();
  };

  updateTwinType: AsyncPutFn = async (uuid, payload, options = {}) => {
    return await this.put(`/api/v1/twintypes/${uuid}`, { data: payload, ...options });
  };

  deleteTwinType: AsyncDeleteFn = async (uuid, options = {}) => {
    return await this.delete(`/api/v1/twintypes/${uuid}`, options);
  };

  // -----------------------
  //        IOT DATA
  // -----------------------

  sendIotData = async (payload: object, options: RequestOptionsWithBody = {}): Promise<APIResponse> => {
    return await this.put("/api/v1/iotdata", { data: payload, ...options });
  };

  queryTSDB: AsyncPostFn<TimeseriesQuery, ResponseFromTSDB> = async (query, options = {}) => {
    const response = await this.post("/api/v2/timeseriesdata", { data: query, ...options });
    return options.rawResponse ? response : await response.json();
  };

  deleteIotData = async (query: TimeseriesQuery, options: RequestOptionsWithBody = {}): Promise<APIResponse> => {
    return await this.delete("/api/v2/timeseriesdata", { data: query, ...options });
  };

  // -----------------------
  //     User Management
  // -----------------------

  getUsers: AsyncGetFn<User[]> = async (options = {}) => {
    const response = await this.get("/api/v2/users", options);
    return options.rawResponse ? response : await response.json();
  };

  getUser: AsyncGetFnWithParam<User> = async (uuid, options = {}) => {
    const response = await this.get(`/api/v2/users/${uuid}`, options);
    return options.rawResponse ? response : await response.json();
  };

  createUser: AsyncPostFn<object, User> = async (payload, options = {}) => {
    const response = await this.post("/api/v2/users", { data: payload, ...options });
    return options.rawResponse ? response : await response.json();
  };

  updateUser: AsyncPutFn = async (uuid, payload, options = {}) => {
    return await this.put(`/api/v2/users/${uuid}`, { data: payload, ...options });
  };

  deleteUser: AsyncDeleteFn = async (uuid, options = {}) => {
    return await this.delete(`/api/v2/users/${uuid}`, options);
  };

  // -----------------------
  //         Roles
  // -----------------------

  getRoles: AsyncGetFn<Role[]> = async (options = {}) => {
    const response = await this.get("/api/v1/authorization/roles", options);
    return options.rawResponse ? response : await response.json();
  };

  getRole: AsyncGetFnWithParam<Role> = async (uuid, options = {}) => {
    const response = await this.get(`/api/v1/authorization/roles${uuid}`, options);
    return options.rawResponse ? response : await response.json();
  };

  createRole: AsyncPostFn<object, Role> = async (payload, options = {}) => {
    const response = await this.post("/api/v1/authorization/roles", { data: payload, ...options });
    return options.rawResponse ? response : await response.json();
  };

  updateRole: AsyncPutFn = async (uuid, payload, options = {}) => {
    return await this.put(`/api/v1/authorization/roles/${uuid}`, { data: payload, ...options });
  };

  deleteRole: AsyncDeleteFn = async (uuid, options = {}) => {
    return await this.delete(`/api/v1/authorization/roles/${uuid}`, options);
  };
}

type TimeseriesQuery = RelativeTimeseriesQuery | AbsoluteTimeseriesQuery;

interface RelativeTimeseriesQuery extends BaseTimeseriesQuery {
  start_relative: RelativeRange;
  end_relative?: RelativeRange;
}

interface AbsoluteTimeseriesQuery extends BaseTimeseriesQuery {
  start_absolute: number;
  end_absolute?: number;
}

interface BaseTimeseriesQuery {
  metrics: {
    name: string;
    limit?: number;
  }[];
}

interface RelativeRange {
  value: string;
  unit: "months" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds";
}

type CrudRequest = (url: string, options?: RequestOptionsWithBody & { rawResponse?: boolean }) => Promise<APIResponse>;

type InferType<T> = T extends infer U ? U : never;

type AsyncPostFn<Payload, ReturnType> = <R extends boolean>(
  payload: Payload,
  options?: RequestOptionsWithBody & {
    /**
     * Whether to return APIResponse instead of parsed response.
     * If true, failOnStatusCode will be false by default.
     */
    rawResponse?: R;
  }
) => Promise<InferType<R> extends true ? APIResponse : ReturnType>;

type AsyncDeleteFn = (id: string, options?: RequestOptionsNoBody) => Promise<APIResponse>;

type AsyncGetFn<ReturnType> = <R extends boolean>(
  options?: RequestOptionsNoBody & {
    /**
     * Whether to return APIResponse instead of parsed response.
     * If true, failOnStatusCode will be false by default.
     */
    rawResponse?: R;
  }
) => Promise<InferType<R> extends true ? APIResponse : ReturnType>;

type AsyncGetFnWithParam<ReturnType> = <R extends boolean>(
  param: string,
  options?: RequestOptionsNoBody & {
    /**
     * Whether to return APIResponse instead of parsed response.
     * If true, failOnStatusCode will be false by default.
     */
    rawResponse?: R;
  }
) => Promise<InferType<R> extends true ? APIResponse : ReturnType>;

type AsyncPutFn = (param: string, payload: object, options?: RequestOptionsNoBody) => Promise<APIResponse>;
