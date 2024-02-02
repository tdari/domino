import { Delete } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import {
  Card,
  CardActionArea,
  CardHeader,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import { type IWorkspaceSummary } from "context/workspaces/types";
import { type FC } from "react";
import { useNavigate } from "react-router-dom";

export const WorkspaceListItem: FC<{
  workspace: IWorkspaceSummary;
  handleSelect: () => void;
  handleDelete: () => void;
  handleLeave: () => void;
  selectedWorkspaceId: string | undefined;
}> = ({
  workspace,
  handleSelect,
  handleDelete,
  handleLeave,
  selectedWorkspaceId,
}) => {
  const isSelected = workspace.id === selectedWorkspaceId;

  const navigate = useNavigate();

  return (
    <Grid
      item
      xs={12}
      md={6}
      lg={4}
      xl={3}
      sx={{ display: "flex", flexDirection: "column" }}
    >
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          flexDirection: "column",
          borderColor: isSelected ? "green" : "primary",
        }}
      >
        <CardActionArea
          onClick={handleSelect}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
            flexGrow: 1,
          }}
        >
          <CardHeader
            title={workspace.workspace_name}
            titleTypographyProps={{ variant: "body1" }}
            color={isSelected ? "success" : "primary.main"}
            sx={{ py: 1 }}
          />
          <CardContent
            sx={{
              width: "100%",
              borderTop: 1,
              borderBottom: 1,
              borderColor: "grey.300",
            }}
          >
            <Grid container>
              <Grid item xs={12} md={3}>
                <Typography sx={{ fontSize: 14, my: 0 }} color="text.secondary">
                  Permission:
                </Typography>
                <Typography sx={{ fontSize: 14, my: 0 }}>
                  {workspace.user_permission}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography sx={{ fontSize: 14, my: 0 }} color="text.secondary">
                  Status:
                </Typography>
                <Typography sx={{ fontSize: 14, my: 0 }}>
                  {workspace.status === "accepted"
                    ? "Collaborating"
                    : "Refused"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </CardActionArea>
        <CardActions sx={{ width: "100%" }}>
          <Button
            size="small"
            color="primary"
            onClick={() => {
              handleSelect();
              navigate("/workspace-settings");
            }}
          >
            <SettingsIcon fontSize="medium" />
          </Button>
          <Button size="small" color="primary" onClick={handleLeave}>
            <LogoutIcon fontSize="medium" />
          </Button>
          <Button size="small" color="error" onClick={handleDelete}>
            <Delete />
          </Button>
          {isSelected ? (
            <Chip
              label="selected"
              variant="filled"
              color="success"
              sx={{ ml: "auto" }}
            />
          ) : (
            ""
          )}
        </CardActions>
      </Card>
    </Grid>
  );
};
