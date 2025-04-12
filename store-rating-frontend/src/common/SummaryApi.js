export const baseURL = import.meta.env.VITE_API_URL;

const SummaryApi = {
  register: {
    url: "api/user/register",
    method: "post",
  },
  login: {
    url: "api/user/login",
    method: "post",
  },
  logout: {
    url: "api/user/logout",
    method: "get",
  },
  getUserDetails: {
    url: "api/user/getUserDetails",
    method: "get",
  },
  getAllUserDetailsAdmin: {
    url: "api/admin/getAllUsersAdmin",
    method: "get",
  },
  createUserAdmin: {
    url: "api/admin/createUserAdmin",
    method: "post",
  },
  getUserDetailsAdmin: {
    url: "api/admin/getAdminDashboard",
    method: "get",
  },
  getAllStores: {
    url: "api/store/getAllStores",
    method: "get",
  },
  createStore: {
    url: "api/store/createStore",
    method: "post",
  },
  submitOrUpdateRating: {
    url: "api/store/:id/rating",
    method: "post",
  },
  getStoreDashboard: {
    url: "api/store/getStoreDashboard",
    method: "get",
  },
};

export default SummaryApi;
