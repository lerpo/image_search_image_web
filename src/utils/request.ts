/**
 * 这是对axios的二次封装，支持泛型传递
 * @Response 这个类型是根据你的业务需求来定义的，这里只是一个示例
 * 当然你可以自己封装请求库
 */
import { message } from "antd";
import Cookies from "js-cookie";
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
//二次封装axios
const createAxios: AxiosInstance = axios.create({
  baseURL: '/',
  timeout: Number(import.meta.env.VITE_TIME_OUT),
  withCredentials: true, // 异步请求携带cookie
  headers: {
    // 设置后端需要的传参类型
    "Content-Type": "application/json;charset=UTF-8",
    // token: Cookies.get("TOKEN_KEY"),
    // c: "pc",
    // r: "merchant",
  },
});

// interface ApiResponse<T = any> {
//   code: number;
//   message: string;
//   data: T;
// }

export interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
}

//请求拦截器
createAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    /**
     * 在这里写你的拦截逻辑
     */
    // config.headers.token = Cookies.get("TOKEN_KEY")
    // console.log('config.headers', config.headers)
    config.headers = {
      ...config.headers
      // ...config.header,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//响应拦截
createAxios.interceptors.response.use(
  (response: AxiosResponse) => {
    /**
     * 响应逻辑
     */
    const data = response?.data;
    if (data?.code === 200) {
      return data;
    } else {
      return Promise.reject("error.message");
    }
  },
  (error) => {
    if (error.response.data.code === 403) {
       
    }
    message.error(error.message || "");
    return Promise.reject("error.message");
  }
);

export default createAxios;
