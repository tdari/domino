import { Paper, Typography } from "@mui/material";
import theme from "providers/theme.config";
import React, { type CSSProperties, memo, useMemo, useState } from "react";
import { Handle, Position } from "reactflow";
import { getUuidSlice } from "utils";

import { type DefaultNodeProps } from "../types";

export const CustomNode = memo<DefaultNodeProps>(({ id, data, selected }) => {
  const [hovered, setHovered] = useState(false);

  const handleStyle = useMemo<CSSProperties>(
    () =>
      hovered
        ? {
            border: 0,
            borderRadius: "16px",
            backgroundColor: theme.palette.info.main,
            transition: "ease 100",
            zIndex: 2,
            width: "12px",
            height: "12px",
          }
        : {
            border: 0,
            borderRadius: "16px",
            backgroundColor: "transparent",
            transition: "ease 100",
            zIndex: 2,
          },
    [hovered],
  );

  const extendedClassExt = useMemo<"input" | "default" | "output">(() => {
    const dominoReactflowClassTypeMap = Object.freeze({
      source: "input",
      default: "default",
      sink: "output",
    });
    if (
      !data?.style.nodeType ||
      !["default", "source", "sink"].includes(data?.style.nodeType)
    ) {
      return "default";
    } else {
      return dominoReactflowClassTypeMap[data.style.nodeType];
    }
  }, [data]);

  const nodeTypeRenderHandleMap = useMemo(
    () => ({
      input: {
        renderTargetHandle: false,
        renderSourceHandle: true,
      },
      output: {
        renderTargetHandle: true,
        renderSourceHandle: false,
      },
      default: {
        renderTargetHandle: true,
        renderSourceHandle: true,
      },
    }),
    [],
  );

  const nodeStyle = useMemo<CSSProperties>(() => {
    return {
      ...data.style.nodeStyle,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",

      position: "relative",
      width: 150,
      height: 70,
      lineHeight: "60px",
      border: selected ? "2px" : "",
      borderStyle: selected ? "solid" : "",
      borderColor: selected ? theme.palette.info.dark : "",
      borderRadius: selected ? "3px" : "",
      ...(data.validationError && {
        backgroundColor: theme.palette.error.light,
        color: theme.palette.error.contrastText,
      }),
    };
  }, [data, selected]);

  const { sourcePosition, targetPosition } = useMemo(
    () => ({
      ...(data.orientation === "horizontal"
        ? {
            targetPosition: Position.Left,
            sourcePosition: Position.Right,
          }
        : {
            targetPosition: Position.Top,
            sourcePosition: Position.Bottom,
          }),
    }),
    [data],
  );

  return (
    <>
      {nodeTypeRenderHandleMap[extendedClassExt].renderSourceHandle && (
        <Handle
          type="source"
          position={sourcePosition}
          id={`source-${id}`}
          style={handleStyle}
        />
      )}
      {nodeTypeRenderHandleMap[extendedClassExt].renderTargetHandle && (
        <Handle
          type="target"
          position={targetPosition}
          id={`target-${id}`}
          style={handleStyle}
        />
      )}
      <Paper
        elevation={selected ? 12 : 3}
        onMouseEnter={() => {
          setHovered(true);
        }}
        onMouseLeave={() => {
          setHovered(false);
        }}
        sx={nodeStyle}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            component="div"
            variant="h5"
            style={{ fontSize: 12 }}
            fontWeight={500}
          >
            {data?.style?.label ? data?.style?.label : data?.name}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            style={{ fontSize: 10 }}
          >
            {getUuidSlice(id)}
          </Typography>
        </div>
      </Paper>
    </>
  );
});

CustomNode.displayName = "CustomNode";
