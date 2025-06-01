import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import Home from "./components/Home.jsx";
import Jobs from "./components/Jobs.jsx";
import Browser from "./components/Browser.jsx";
import Profile from "./components/Profile.jsx";
import JobDescription from "./components/JobDescription.jsx";
import Companies from "./components/admin/Companies.jsx";
import CompanyCreate from "./components/admin/CompanyCreate.jsx";
import CompanySetup from "./components/admin/CompanySetup.jsx";
import AdminJobs from "./components/admin/AdminJobs.jsx";
import PostJob from "./components/admin/PostJob.jsx";
import Applicants from "./components/admin/Applicants.jsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.jsx";
import AttendanceForm from "./components/AttendanceForm.jsx";
import AttendanceTracker from "./components/admin/AttendanceTracker.jsx";
import Layout from "./components/Layout.jsx";
import { SidebarProvider } from "@/components/ui/sidebar";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
   {
    element: (
      <SidebarProvider>
        <Layout />
      </SidebarProvider>
    ),
    children: [
     {
        path: "/attendance",
        element: <AttendanceForm />,
      },
       {
        path: "/admin/attendance",
        element: (
          <ProtectedRoute>
            <AttendanceTracker />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // {
  //   element: <Layout />, 
  //   children: [
  //     {
  //       path: "/jobs",
  //       element: <Jobs />,
  //     },
  //     {
  //       path: "/description/:id",
  //       element: <JobDescription />,
  //     },
  //     {
  //       path: "/browse",
  //       element: <Browser />,
  //     },
  //     {
  //       path: "/profile",
  //       element: <Profile />,
  //     },
  //     {
  //       path: "/attendance",
  //       element: <AttendanceForm />,
  //     },
  //     {
  //       path: "/admin/companies",
  //       element: (
  //         <ProtectedRoute>
  //           <Companies />
  //         </ProtectedRoute>
  //       ),
  //     },
  //     {
  //       path: "/admin/companies/create",
  //       element: (
  //         <ProtectedRoute>
  //           <CompanyCreate />
  //         </ProtectedRoute>
  //       ),
  //     },
  //     {
  //       path: "/admin/companies/:id",
  //       element: (
  //         <ProtectedRoute>
  //           <CompanySetup />
  //         </ProtectedRoute>
  //       ),
  //     },
  //     {
  //       path: "/admin/jobs",
  //       element: (
  //         <ProtectedRoute>
  //           <AdminJobs />
  //         </ProtectedRoute>
  //       ),
  //     },
  //     {
  //       path: "/admin/jobs/create",
  //       element: (
  //         <ProtectedRoute>
  //           <PostJob />
  //         </ProtectedRoute>
  //       ),
  //     },
  //     {
  //       path: "/admin/jobs/:id/applicants",
  //       element: (
  //         <ProtectedRoute>
  //           <Applicants />
  //         </ProtectedRoute>
  //       ),
  //     },
  //     {
  //       path: "/admin/attendance",
  //       element: (
  //         <ProtectedRoute>
  //           <AttendanceTracker />
  //         </ProtectedRoute>
  //       ),
  //     },
  //   ],
  // },
]);

function App() {
  return (
    <>
      <SidebarProvider>
      <RouterProvider router={appRouter} />
    </SidebarProvider>
    </>
  );
}

export default App;
