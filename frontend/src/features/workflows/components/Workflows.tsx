import LoopIcon from "@mui/icons-material/Loop";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import TabContext from "@mui/lab/TabContext";
import { Button, Grid, Typography, Breadcrumbs, Link } from "@mui/material";
import { useWorkflows } from "features/workflows/context/workflows";
import React, { useState, useMemo } from "react";

import { WorkflowsRunsTable } from "./WorkflowsRunsTable";
import { WorkflowRunTaskFlowchart } from "./WorkflowsRunTasksFlowchart";
import { WorkflowsTable } from "./WorkflowsTable";

/**
 * @todo continue refactor of SummaryWorkflows
 */
export const WorkflowsComponent: React.FC = () => {
  const [value, setValue] = useState<string>("1");

  const {
    selectedWorkflow,
    selectedWorkflowRunId,
    handleRefreshWorkflows,
    workflowRuns,
  } = useWorkflows();

  const breadcrumbs = useMemo(() => {
    let executionDate = null;
    if (workflowRuns.data && selectedWorkflowRunId) {
      executionDate = workflowRuns?.data?.find(
        (run: { workflow_run_id: any }) =>
          run.workflow_run_id === selectedWorkflowRunId,
      )?.execution_date;
      executionDate = executionDate
        ? new Date(executionDate).toLocaleString()
        : "";
    }
    const tabsBreadcrumbs = [
      <Link
        underline="hover"
        color="inherit"
        href="#"
        key="1"
        onClick={() => {
          setValue("1");
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{ padding: "0px", marginLeft: "0px" }}
        >
          {/* <Tooltip title="Workflows are a collection of tasks that can be run in a specific order.">
              <HelpOutlineOutlinedIcon style={{ marginRight: '5px', 'cursor': 'help', fontSize: '18px' }} />
            </Tooltip> */}
          Workflows
        </Typography>
      </Link>,
      <Link
        underline="hover"
        color="inherit"
        href="#"
        key="2"
        onClick={() => {
          setValue("2");
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{ padding: "0px", marginLeft: "0px" }}
        >
          {selectedWorkflow?.name} runs
        </Typography>
      </Link>,
      <Link
        underline="hover"
        color="inherit"
        href="#"
        key="3"
        onClick={() => {
          setValue("3");
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          sx={{ padding: "0px", marginLeft: "0px" }}
        >
          {executionDate}
        </Typography>
      </Link>,
    ];
    switch (true) {
      case selectedWorkflow !== null && selectedWorkflowRunId !== null:
        // change to tab 3 (tasks)
        setValue("3");
        return [tabsBreadcrumbs.slice(0, 3)];
      case selectedWorkflow && !selectedWorkflowRunId:
        // change to tab 2 (runs)
        setValue("2");
        return [tabsBreadcrumbs.slice(0, 2)];
      default:
        // change to tab 1 (workflows)
        setValue("1");
        return [tabsBreadcrumbs.slice(0, 1)];
    }
  }, [selectedWorkflow, selectedWorkflowRunId, workflowRuns]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Breadcrumbs
          aria-label="breadcrumb"
          maxItems={3}
          separator={<NavigateNextIcon fontSize="medium" />}
        >
          {breadcrumbs}
        </Breadcrumbs>
      </Grid>
      <TabContext value={value}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Button
            color="primary"
            variant="outlined"
            startIcon={<LoopIcon />}
            onClick={handleRefreshWorkflows}
            sx={{ mx: 1 }}
          >
            Refresh
          </Button>
        </Grid>
        <Grid item xs={12}>
          {value === "1" ? (
            <WorkflowsTable />
          ) : value === "2" ? (
            <WorkflowsRunsTable />
          ) : value === "3" ? (
            <WorkflowRunTaskFlowchart />
          ) : (
            ""
          )}
        </Grid>
      </TabContext>
    </Grid>
  );
};
