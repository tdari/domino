// TODO move to /runs
import { type MutationConfig } from "@services/clients/react-query.client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dominoApiClient } from "services/clients/domino.client";

interface PatchRepositorySecretParams {
  repositoryId: string;
  secretId: string;
  payload: {
    value: string | null;
  };
}

export const useUpdateRepositorySecret = (
  config: MutationConfig<PatchRepositorySecretParams, void> = {},
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: PatchRepositorySecretParams) => {
      await patchRepositorySecret(params);
    },
    onSuccess: async (_, { repositoryId }) => {
      await queryClient.invalidateQueries({
        queryKey: ["REPOSITORIES-SECRETS", repositoryId],
      });
    },
    ...config,
  });
};

const patchRepositorySecret: (
  params: PatchRepositorySecretParams,
) => Promise<void> = async ({ payload, repositoryId, secretId }) => {
  await dominoApiClient.patch(
    `/pieces-repositories/${repositoryId}/secrets/${secretId}`,
    payload,
  );
};
