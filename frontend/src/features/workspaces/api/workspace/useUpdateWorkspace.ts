// TODO move to /runs
import { type WorkspaceSummary } from "@context/workspaces/types";
import { type MutationConfig } from "@services/clients/react-query.client";
import { useMutation } from "@tanstack/react-query";
import { dominoApiClient } from "services/clients/domino.client";

interface PatchWorkspaceParams {
  name?: string | null;
  github_access_token?: string | null;
}

interface UseUpdateWorkspace {
  workspaceId?: string;
}

export const useUpdateWorkspace = (
  { workspaceId }: UseUpdateWorkspace,
  config: MutationConfig<PatchWorkspaceParams, WorkspaceSummary> = {},
) => {
  return useMutation({
    mutationKey: ["WORKSPACE"],
    mutationFn: async (params) => {
      if (!workspaceId) throw new Error("No workspace selected");

      return await patchWorkspace({ workspaceId, ...params });
    },
    ...config,
  });
};

const patchWorkspace = async ({
  workspaceId,
  ...params
}: PatchWorkspaceParams & UseUpdateWorkspace): Promise<WorkspaceSummary> => {
  return await dominoApiClient.patch(`/workspaces/${workspaceId}`, params);
};
