import json
import pytest
from httpx import Response


from schemas.responses.workspace import CreateWorkspaceResponse, ListUserWorkspacesResponse, GetWorkspaceResponse, PatchWorkspaceResponse
from database.models.workspace import Workspace
from database.models.enums import Permission

pytest_plugins=[
    "tests.workspace.fixtures"
]

@pytest.mark.usefixtures("register", "login")
class TestWorkspaceRouter:
    @staticmethod
    def test_create_workspace(workspace: Workspace, create_workspace: Response):
        mock_response = CreateWorkspaceResponse(
            id=workspace.id, 
            name=workspace.name,
        )
        response = create_workspace
        content = response.json()
        mock_response_content = json.loads(mock_response.json())
        
        assert response.status_code == 200
        assert content.keys() == mock_response_content.keys()
        for key in content:
            assert content.get(key) == mock_response_content.get(key)
    
    @staticmethod
    def test_get_workspaces(create_workspace: Response, workspace: Workspace, get_workspaces: Response):
        mock_response = [
            ListUserWorkspacesResponse(
                id=workspace.id, 
                workspace_name=workspace.name, 
                github_access_token_filled=False,
                user_permission=Permission.owner.value
            )
        ]
        response = get_workspaces
        content = response.json()
        mock_response_content = json.loads(mock_response[0].json())
        
        assert response.status_code == 200
        assert content[0]["workspace_name"].startswith("Default")
        assert content[0]["user_permission"] == Permission.owner.value
        assert content[1].keys() == mock_response_content.keys()
        for key in content[1].keys():
            assert content[1].get(key) == mock_response_content.get(key)

    @staticmethod
    def test_get_workspace(create_workspace: Response, get_workspace: Response, workspace: Workspace):
        mock_response = GetWorkspaceResponse(
            id=workspace.id,
            workspace_name=workspace.name,
            github_access_token_filled=False,
            user_permission=Permission.owner.value
        )
        response = get_workspace
        content = response.json()
        mock_response_content = json.loads(mock_response.json())
        
        assert response.status_code == 200
        assert content.keys() == mock_response_content.keys()
        for key in content.keys():
            assert content.get(key) == mock_response_content.get(key)

    @staticmethod
    def test_patch_workspace(create_workspace: Response, patch_workspace: Response, workspace: Response):
        mock_response = PatchWorkspaceResponse(
            id=workspace.id,
            workspace_name=workspace.name,
            github_access_token_filled=True,
            user_permission=Permission.owner.value
        )
        response = patch_workspace
        content = response.json()
        mock_response_content = json.loads(mock_response.json())
        assert response.status_code == 200
        assert content.keys() == mock_response_content.keys()
        for key in content.keys():
            assert content.get(key) == mock_response_content.get(key)
    
    @staticmethod
    def test_delete_workspace(create_workspace: Response, delete_workspace: Response, get_workspace: Response):
        response = delete_workspace
        assert response.status_code == 204
        response = get_workspace
        assert response.status_code == 404