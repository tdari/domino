import PrivateLayout from "@components/PrivateLayout";
import { NotFoundRoute } from "@components/Routes/NotFoundRoute";
import { MyWorkflowsRoutes } from "@features/myWorkflows/routes";
import { WorkflowEditorRoute } from "@features/workflowEditor/routes";
import { WorkspaceRoute } from "@features/workspaces/routes";
import { Box } from "@mui/material";
import Loading from "components/Loading";
import { useAuthentication } from "context/authentication";
import { WorkspacesProvider } from "context/workspaces";
import PiecesProvider from "context/workspaces/repositories";
import React, { Suspense } from "react";
import { Navigate, Outlet, redirect } from "react-router-dom";
// import { lazyImport } from "utils";

const App = () => {
  const { isLogged } = useAuthentication();

  if (!isLogged) {
    redirect("/sign-in");
  }

  return (
    <Suspense
      fallback={
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Loading />
        </Box>
      }
    >
      <WorkspacesProvider>
        <PiecesProvider>
          <Outlet />
        </PiecesProvider>
      </WorkspacesProvider>
    </Suspense>
  );
};

export const protectedRoutes = [
  {
    path: "/*",
    element: <App />,

    children: [
      { path: "workspaces/*", element: <WorkspaceRoute /> },
      { path: "my-workflows/*", element: <MyWorkflowsRoutes /> },
      { path: "workflows-editor/*", element: <WorkflowEditorRoute /> },
      {
        path: "unauthorized",
        element: <div>Unauthorized</div>,
      },
      {
        path: "404",
        element: (
          <PrivateLayout>
            <NotFoundRoute />
          </PrivateLayout>
        ),
      },
      {
        path: "*",
        element: (
          <Navigate to="/404" replace state={{ from: location.pathname }} />
        ),
      },
    ],
  },
];