import React, { useCallback, useEffect, useState } from "react";
import { Node } from "reactflow";
import localForage from "services/config/local-forage.config";
import { IWorkflowElement } from "services/requests/workflow";
import { createCustomContext } from "utils";

export interface IWorkflowsNodesContext {
  nodes: IWorkflowElement[] | Node[]
  setNodes: React.Dispatch<React.SetStateAction<IWorkflowElement[] | Node[]>>
  fetchForageWorkflowNodes: () => Promise<IWorkflowElement[]>
  nodeDirection: "horizontal" | "vertical"
  toggleNodeDirection: () => void
}

export const [WorkflowsNodesContext, useWorkflowsNodes] =
  createCustomContext<IWorkflowsNodesContext>('WorkflowsNodes Context')

const WorkflowsNodesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodeDirection, setNodeDirection] = useState<'horizontal' | 'vertical'>('horizontal')
  const [nodes, setNodes] = useState<IWorkflowElement[]>([])
  const [loadingNodes, setLoadingNodes] = useState<boolean>(true)

  const setForageWorkflowNodes = useCallback(async (nodes: IWorkflowElement[]) => {
    await localForage.setItem('workflowNodes', nodes)
  }, [])

  const fetchForageWorkflowNodes = useCallback(async () => {
    var workflowNodes = await localForage.getItem<any>("workflowNodes")
    if ((!workflowNodes) || (workflowNodes.length === 0)) {
      workflowNodes = []
    }
    return workflowNodes
  }, [])

  useEffect(() => {
    (async () => {
      const forageNodes = await fetchForageWorkflowNodes()
      await setForageWorkflowNodes(forageNodes)
      setLoadingNodes(false)
    })()
  }, [])

  // Update nodes in forage if nodes array is updated
  useEffect(() => {
    (async () => {
      if (loadingNodes) {
        return
      }
      await setForageWorkflowNodes(nodes)
    })()
  }, [nodes, setForageWorkflowNodes, loadingNodes])

  const value = {
    nodes,
    setNodes,
    fetchForageWorkflowNodes: () => fetchForageWorkflowNodes(),
    nodeDirection,
    toggleNodeDirection: () =>
      setNodeDirection((current: any) =>
        current === 'vertical' ? 'horizontal' : 'vertical'
      )
  }

  return (
    <WorkflowsNodesContext.Provider value={value}>
      {children}
    </WorkflowsNodesContext.Provider>
  )
}

export default WorkflowsNodesProvider