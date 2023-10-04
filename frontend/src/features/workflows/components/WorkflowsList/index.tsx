import { Paper } from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridEventListener,
} from "@mui/x-data-grid";
import { NoDataOverlay } from "components/NoDataOverlay";
import {
  useAuthenticatedDeleteWorkflowId,
  useAuthenticatedGetWorkflows,
  useAuthenticatedPostWorkflowRunId,
} from "features/workflows/api";
import { type IWorkflow } from "features/workflows/types";
import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useInterval } from "utils";

import { Actions } from "./Actions";
import { Status } from "./Status";
import { WorkflowsListSkeleton } from "./WorkflowsListSkeleton";

/**
 * @todo Cancel run. []
 * @todo Pause run. []
 */

export const WorkflowList: React.FC = () => {
  const navigate = useNavigate();
  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 10,
    page: 0,
  });

  const {
    data: workflows,
    isLoading,
    mutate: handleRefreshWorkflows,
  } = useAuthenticatedGetWorkflows(
    paginationModel.page,
    paginationModel.pageSize,
  );
  const handleDeleteWorkflow = useAuthenticatedDeleteWorkflowId();
  const handleRunWorkflow = useAuthenticatedPostWorkflowRunId();

  const deleteWorkflow = useCallback(async (id: IWorkflow["id"]) => {
    try {
      await handleDeleteWorkflow({ id: String(id) });
      await handleRefreshWorkflows();
    } catch (e) {
      console.error(e);
    }
  }, []);
  const runWorkflow = useCallback(async (id: IWorkflow["id"]) => {
    try {
      await handleRunWorkflow({ id: String(id) });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const pauseWorkflow = useCallback((_id: IWorkflow["id"]) => {}, []);

  const { rows, totalRows } = useMemo(
    () => ({
      rows: workflows?.data ?? [],
      totalRows: workflows?.metadata?.total ?? 0,
    }),
    [workflows],
  );

  const columns = useMemo<Array<GridColDef<IWorkflow>>>(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 80,
        headerAlign: "center",
        align: "center",
        sortable: false,
      },
      {
        field: "status",
        headerName: "Status",
        renderCell: (params) => <Status status={params.row.status} />,
        flex: 0.5,
        align: "center",
        headerAlign: "center",
        sortable: false,
      },
      { field: "name", headerName: "Workflow Name", flex: 2 },
      {
        field: "created_at",
        headerName: "Created At",
        flex: 1,
        align: "center",

        valueFormatter: ({ value }) => new Date(value).toLocaleString(),
        headerAlign: "center",
      },
      {
        field: "last_changed_at",
        headerName: "Last Modified",
        flex: 1,
        align: "center",
        valueFormatter: ({ value }) => new Date(value).toLocaleString(),
        headerAlign: "center",
      },
      {
        field: "schedule_interval",
        headerName: "Schedule Interval",
        flex: 1,
        align: "center",
        headerAlign: "center",
        sortable: false,
      },
      {
        field: "actions",
        headerName: "Actions",
        flex: 1,
        renderCell: ({ row }) => (
          <Actions
            id={row.id}
            className=".action-button"
            deleteFn={() => {
              void deleteWorkflow(row.id);
            }}
            runFn={() => {
              void runWorkflow(row.id);
            }}
            pauseFn={() => {
              pauseWorkflow(row.id);
            }}
          />
        ),
        headerAlign: "center",
        align: "center",
        sortable: false,
      },
    ],
    [],
  );

  const handleRowClick = useCallback<GridEventListener<"rowClick">>(
    (row, event) => {
      const isActionButtonClick =
        event.target instanceof Element &&
        event.target.classList.contains(".action-button");
      if (!isActionButtonClick) {
        // Handle row click logic only if it's not an action button click
        navigate(`/workflows/${row.id}`);
      }
    },
    [navigate],
  );

  useInterval(handleRefreshWorkflows, 5000);

  if (isLoading) {
    return <WorkflowsListSkeleton />;
  }

  return (
    <>
      <Paper sx={{ height: "80vh" }}>
        <DataGrid
          density="comfortable"
          columns={columns}
          rows={rows}
          onRowClick={handleRowClick}
          pagination
          paginationMode="server"
          pageSizeOptions={[5, 10, 25]}
          initialState={{
            pagination: {
              paginationModel,
            },
          }}
          rowCount={totalRows}
          onPaginationModelChange={setPaginationModel}
          disableDensitySelector
          disableRowSelectionOnClick
          hideFooterSelectedRowCount
          disableColumnMenu
          disableColumnSelector
          slots={{ noRowsOverlay: NoDataOverlay }}
          sx={{
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
              outline: "none",
            },
          }}
        />
      </Paper>
    </>
  );
};
