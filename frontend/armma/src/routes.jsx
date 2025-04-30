
import Dashboard from './views/Dashboard.jsx'
import UserProfile from "./views/UserProfile.jsx";
import TableList from "./views/TableList.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import Transfer from "./views/Transfer.jsx"

const dashboardRoutes = [
  {
    path: "/accounts",
    name: "My accounts",
    icon: "bi bi-coin",
    component: Dashboard,
    layout: "/dashboard"
  },
  {
    path: "/user",
    name: "Profile",
    icon: "bi bi-person-fill",
    component: UserProfile,
    layout: "/dashboard"
  },
  {
    path: "/transfer",
    name: "Transfer money",
    icon: "bi bi-arrow-left-right",
    component: Transfer,
    layout: "/dashboard"
  },
  {
    path: "/transactions",
    name: "Transactions",
    icon: "bi bi-clock-history",
    component: TableList,
    layout: "/dashboard"
  }
];

export default dashboardRoutes;
