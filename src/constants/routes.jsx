import ActivityPage from "../pages/Activity/ActivityPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SearchPage from "../pages/Search/SearchPage";
import UserProfilePage from "../pages/UserProfile/UserProfilePage";

export const routes = [
  {
    id: 1,
    path: "/",
    element: <DashboardPage />,
  },
  {
    id: 2,
    path: "/search",
    element: <SearchPage />,
  },
  {
    id: 3,
    path: "/activity",
    element: <ActivityPage />,
  },
  {
    id: 4,
    path: "/:username",
    element: <ProfilePage />,
  },
  {
    id: 5,
    path: "/user/:nickName",
    element: <UserProfilePage />,
  },
];
