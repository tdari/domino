import { Button, Card, Grid, Skeleton } from "@mui/material";
import { DataGrid, type GridColumns } from "@mui/x-data-grid";
import { useAuthenticatedGetWorkflowRuns } from "features/workflows/api";
import { type IWorkflowRuns } from "features/workflows/types";
import React, { useEffect, useMemo, useState } from "react";
import { useInterval } from "utils/useAutoSave";

import { States } from "./States";

interface Props {
  workflowId: string;
}

export const WorkflowRunsTable: React.FC<Props> = ({ workflowId }) => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const {
    data: workflowRuns,
    isLoading,
    mutate,
  } = useAuthenticatedGetWorkflowRuns({
    page,
    pageSize,
    workflowId,
  });

  const columns = useMemo<GridColumns<IWorkflowRuns>>(
    () => [
      {
        field: "start_date",
        headerName: "Start Date",
        headerAlign: "center",
        align: "center",
        type: "string",
        flex: 1,
        minWidth: 150,
        valueFormatter: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        field: "end_date",
        headerName: "End Date",
        headerAlign: "center",
        align: "center",
        type: "string",
        flex: 1,
        minWidth: 150,
        valueFormatter: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        field: "execution_date",
        headerName: "Execution Date",
        headerAlign: "center",
        align: "center",
        minWidth: 150,
        flex: 1,
        valueFormatter: ({ value }) => new Date(value).toLocaleString(),
      },
      {
        field: "state",
        headerName: "State",
        headerAlign: "center",
        align: "center",
        type: "string",
        minWidth: 150,
        // flex: 1,
        renderCell: (params) => {
          return <States state={params.value} />;
        },
      },
    ],
    [],
  );

  const { rows, totalRows } = useMemo(
    () => ({
      // every column need a id prop in DataGrid component
      rows:
        workflowRuns?.data?.map((wr) => ({ ...wr, id: wr.workflow_run_id })) ??
        [],
      totalRows: workflowRuns?.metadata?.total ?? 0,
    }),
    [workflowRuns],
  );

  useEffect(() => {
    if (!isLoading && workflowRuns?.data && workflowRuns?.data?.length > 0) {
      setSelectedRow(workflowRuns.data[0].workflow_run_id);
    }
  }, [isLoading, workflowRuns]);

  useInterval(mutate, 3000);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Grid container spacing={3} justifyContent="end">
          <Grid item xs={1}>
            <Button variant="contained"> New Run </Button>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained"> Cancel </Button>
          </Grid>
          <Grid item xs={1}>
            <Button variant="contained"> Refresh</Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ height: "40vh" }}>
          {isLoading ? (
            <Skeleton
              animation="wave"
              variant="rounded"
              sx={{ height: "100%" }}
            />
          ) : (
            <DataGrid
              density="compact"
              onSelectionModelChange={([id]) => {
                setSelectedRow(id as string);
              }}
              selectionModel={selectedRow ? [selectedRow] : []}
              columns={columns}
              rows={rows}
              pagination
              rowsPerPageOptions={[10, 15, 20]}
              paginationMode="server"
              pageSize={pageSize}
              page={page}
              rowCount={totalRows}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              disableDensitySelector
              hideFooterSelectedRowCount
              disableColumnMenu
              disableColumnSelector
              sx={{
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
                  outline: "none",
                },
              }}
            />
          )}
        </Card>
      </Grid>
    </Grid>
  );
};
