import {
  Box,
  ButtonBase,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { useState, useRef, useEffect } from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import useResponsiveSize from "../utils/useResponsiveSize";
import Lottie from "react-lottie";

const OutlineIconTextButton = ({
  onClick,
  isFocused,
  bgColor,
  Icon,
  focusBGColor,
  disabled,
  renderRightComponent,
  fillColor,
  lottieOption,
  tooltipTitle,
  btnID,
  buttonText,
  large,
  isRequestProcessing,
}) => {
  const theme = useTheme();
  const [mouseOver, setMouseOver] = useState(false);
  const [mouseDown, setMouseDown] = useState(false);
  const [blinkingState, setBlinkingState] = useState(1);

  const intervalRef = useRef();

  const { animationsEnabled } = useMeetingAppContext();

  const iconSize = useResponsiveSize({
    xl: 22 * (large ? 1 : 1),
    lg: 22 * (large ? 1 : 1),
  });

  const startBlinking = () => {
    intervalRef.current = setInterval(() => {
      setBlinkingState((s) => (s === 1 ? 0.4 : 1));
    }, 600);
  };

  const stopBlinking = () => {
    clearInterval(intervalRef.current);

    setBlinkingState(1);
  };

  useEffect(() => {
    if (isRequestProcessing) {
      startBlinking();
    } else {
      stopBlinking();
    }
  }, [isRequestProcessing]);

  useEffect(() => {
    return () => {
      stopBlinking();
    };
  }, []);

  return (
    <Tooltip placement="bottom" title={tooltipTitle || ""}>
      <ButtonBase
        id={btnID}
        onMouseEnter={() => {
          setMouseOver(true);
        }}
        onMouseLeave={() => {
          setMouseOver(false);
        }}
        onMouseDown={() => {
          setMouseDown(true);
        }}
        onMouseUp={() => {
          setMouseDown(false);
        }}
        disabled={disabled}
        onClick={onClick}
        style={{
          padding: "8px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: theme.spacing(1),
          overflow: "hidden",
          backgroundColor: bgColor
            ? bgColor
            : isFocused
            ? focusBGColor || "#fff"
            : theme.palette.background.default,
          border: `${2}px solid ${
            mouseOver || mouseDown
              ? "transparent"
              : bgColor
              ? bgColor
              : focusBGColor
              ? focusBGColor
              : "#ffffff33"
          }`,
          transition: `all ${200 * (animationsEnabled ? 1 : 0.5)}ms`,
          transitionTimingFunction: "linear",
          cursor: "pointer",
          opacity: blinkingState,
        }}
      >
        <Box
          style={{
            opacity: disabled ? 0.7 : 1,
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: theme.spacing(1),
            transform: `scale(${mouseOver ? (mouseDown ? 0.97 : 1.05) : 1})`,
            transition: `all ${200 * (animationsEnabled ? 1 : 0.5)}ms`,
            transitionTimingFunction: "linear",
          }}
        >
          {buttonText ? (
            lottieOption ? (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Lottie
                  style={{ height: iconSize }}
                  options={lottieOption}
                  eventListeners={[{ eventName: "done" }]}
                  height={iconSize}
                  width={
                    (iconSize * lottieOption?.width) / lottieOption?.height
                  }
                  isClickToPauseDisabled
                />
              </Box>
            ) : (
              <Typography
                variant="subtitle2"
                style={{
                  fontWeight: "bold",
                  color: isFocused ? "#1C1F2E" : "#fff",
                }}
              >
                {buttonText}
              </Typography>
            )
          ) : null}
        </Box>

        {typeof renderRightComponent === "function" && renderRightComponent()}
      </ButtonBase>
    </Tooltip>
  );
};

export default OutlineIconTextButton;
