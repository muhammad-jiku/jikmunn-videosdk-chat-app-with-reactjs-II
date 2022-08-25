import { makeStyles } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { RECORDER_MAX_GRID_SIZE } from "./CONSTS";
import { validURL } from "./utils/common";
import useIsMobile from "./utils/useIsMobile";
import useIsTab from "./utils/useIsTab";

export const MeetingAppContext = createContext();

export const useMeetingAppContext = () => useContext(MeetingAppContext);

export const sideBarModes = {
  PARTICIPANTS: "PARTICIPANTS",
  CHAT: "CHAT",
  ACTIVITIES: "ACTIVITIES",
  ADD_LIVE_STREAM: "ADD_LIVE_STREAM",
  CONFIGURATION: "CONFIGURATION",
};

export const sideBarNestedModes = {
  POLLS: "POLLS",
  CREATE_POLL: "CREATE_POLL",
  QNA: "QNA",
};

const useStyles = makeStyles((theme) => ({
  container: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.text.primary,
  },
}));

export const meetingLayouts = {
  SPOTLIGHT: "SPOTLIGHT",
  SIDEBAR: "SIDEBAR",
  GRID: "GRID",
  UNPINNED_SIDEBAR: "UNPINNED_SIDEBAR",
  UNPINNED_SPOTLIGHT: "UNPINNED_SPOTLIGHT",
};

export const meetingLayoutPriorities = {
  SPEAKER: "SPEAKER",
  PIN: "PIN",
};

export const meetingLayoutTopics = {
  MEETING_LAYOUT: "MEETING_LAYOUT",
  RECORDING_LAYOUT: "RECORDING_LAYOUT",
  LIVE_STREAM_LAYOUT: "LIVE_STREAM_LAYOUT",
  HLS_LAYOUT: "HLS_LAYOUT",
};

export const MeetingAppProvider = ({
  children,
  redirectOnLeave,
  chatEnabled,
  screenShareEnabled,
  pollEnabled,
  whiteboardEnabled,
  participantCanToggleSelfWebcam,
  participantCanToggleSelfMic,
  raiseHandEnabled,
  recordingEnabled,
  recordingWebhookUrl,
  recordingAWSDirPath,
  autoStartRecording,
  autoStartHls,
  participantCanToggleRecording,
  participantCanToggleHls,
  brandingEnabled,
  brandLogoURL,
  brandName,
  waitingScreenImageUrl,
  waitingScreenText,
  participantCanLeave,
  participantCanEndMeeting,
  poweredBy,
  liveStreamEnabled,
  hlsEnabled,
  autoStartLiveStream,
  // liveStreamLayoutType,
  // liveStreamLayoutPriority,
  // liveStreamLayoutGridSize,
  liveStreamOutputs,
  askJoin,
  participantCanToggleOtherMic,
  participantCanToggleOtherWebcam,
  partcipantCanToogleOtherScreenShare,
  participantTabPanelEnabled,
  participantCanToggleOtherMode,
  canRemoveOtherParticipant,
  notificationSoundEnabled,
  canPin,
  canCreatePoll,
  canToggleParticipantTab,
  selectedMic,
  selectedWebcam,
  joinScreenWebCam,
  joinScreenMic,
  canToggleWhiteboard,
  canDrawOnWhiteboard,
  meetingLeft,
  setMeetingLeft,
  animationsEnabled,
  topbarEnabled,
  notificationAlertsEnabled,
  debug,
  mode,
  layoutType,
  layoutPriority,
  meetingLayoutTopic,
  layoutGridSize,
  // recordingLayoutType,
  // recordingLayoutPriority,
  // recordingLayoutGridSize,
  hideLocalParticipant,
  alwaysShowOverlay,
  sideStackSize,
  canChangeLayout,

  participantCanToggleLivestream,
  reduceEdgeSpacing,
  isRecorder,
  maintainVideoAspectRatio,
  networkBarEnabled,
  hlsPlayerControlsVisible,
}) => {
  const containerRef = useRef();
  const endCallContainerRef = useRef();

  const classes = useStyles();
  const [sideBarMode, setSideBarMode] = useState(null);
  const [sideBarNestedMode, setSideBarNestedMode] = useState(null);
  const [activeSortedParticipants, setActiveSortedParticipants] = useState([]);
  const [mainViewParticipants, setMainViewParticipants] = useState([]);
  const [overlaidInfoVisible, setOverlaidInfoVisible] = useState(true);
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState([]);
  const [userHasInteracted, setUserHasInteracted] = useState(true);
  const [whiteboardState, setWhiteboardState] = useState({
    started: false,
    state: null,
  });
  const [appMeetingLayout, setAppMeetingLayout] = useState({
    type: layoutType,
    gridSize: isRecorder ? RECORDER_MAX_GRID_SIZE : layoutGridSize,
    priority: layoutPriority,
  });
  const [liveStreamConfig, setLiveStreamConfig] = useState([]);
  const [meetingMode, setMeetingMode] = useState(mode);
  const [downstreamUrl, setDownstreamUrl] = useState(null);
  const [afterMeetingJoinedHLSState, setAfterMeetingJoinedHLSState] =
    useState(null);

  const [draftPolls, setDraftPolls] = useState([]);
  const [optionArr, setOptionArr] = useState([
    // {
    //   id: uuid(),
    //   question: null,
    //   options: [{ optionId: uuid(), option: null, isCorrect: false }],
    //   createdAt: new Date(),
    //   timeout: 0,
    //   isActive: false,
    // },
  ]);

  const [createdPolls, setCreatedPolls] = useState([]);
  const [endedPolls, setEndedPolls] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const polls = useMemo(
    () =>
      createdPolls.map((poll) => ({
        ...poll,
        isActive:
          endedPolls.findIndex(({ pollId }) => pollId === poll.id) === -1,
      })),
    [createdPolls, endedPolls]
  );

  const whiteboardStarted = useMemo(
    () => whiteboardState.started,
    [whiteboardState]
  );

  useEffect(() => {
    if (!validURL(redirectOnLeave)) {
      throw new Error("Ridirect url not valid");
    }
  }, [redirectOnLeave]);

  const isMobile = useIsMobile();
  const isTab = useIsTab();

  const meetingLayout = useMemo(() => {
    return appMeetingLayout.priority === "PIN"
      ? appMeetingLayout.type === meetingLayouts.SPOTLIGHT
        ? meetingLayouts.SPOTLIGHT
        : appMeetingLayout.type === meetingLayouts.SIDEBAR
        ? meetingLayouts.SIDEBAR
        : meetingLayouts.GRID
      : appMeetingLayout.type === meetingLayouts.SPOTLIGHT
      ? meetingLayouts.UNPINNED_SPOTLIGHT
      : appMeetingLayout.type === meetingLayouts.SIDEBAR
      ? meetingLayouts.UNPINNED_SIDEBAR
      : meetingLayouts.GRID;
  }, [appMeetingLayout, meetingLayouts]);

  return (
    <MeetingAppContext.Provider
      value={{
        // default options
        selectedMic,
        selectedWebcam,
        joinScreenWebCam,
        joinScreenMic,
        canChangeLayout,
        participantCanToggleLivestream,
        // refs
        containerRef,
        endCallContainerRef,

        // params
        redirectOnLeave,
        chatEnabled,
        screenShareEnabled,
        pollEnabled,
        whiteboardEnabled,
        participantCanToggleSelfWebcam,
        participantCanToggleSelfMic,
        participantTabPanelEnabled,
        raiseHandEnabled,
        recordingEnabled,
        meetingLayoutTopic,
        recordingWebhookUrl,
        recordingAWSDirPath,
        autoStartRecording,
        autoStartHls,
        participantCanToggleRecording,
        participantCanToggleHls,
        brandingEnabled,
        brandLogoURL,
        brandName,
        waitingScreenImageUrl,
        waitingScreenText,
        participantCanLeave,
        participantCanEndMeeting,
        poweredBy,
        liveStreamEnabled,
        hlsEnabled,
        autoStartLiveStream,
        // liveStreamLayoutType,
        // liveStreamLayoutPriority,
        // liveStreamLayoutGridSize,
        liveStreamOutputs,
        askJoin,
        participantCanToggleOtherMic,
        participantCanToggleOtherWebcam,
        partcipantCanToogleOtherScreenShare,
        participantCanToggleOtherMode,
        canRemoveOtherParticipant,
        notificationSoundEnabled,
        canToggleWhiteboard,
        canDrawOnWhiteboard,
        canCreatePoll,
        canToggleParticipantTab,
        animationsEnabled,
        topbarEnabled,
        notificationAlertsEnabled,
        debug,
        mode,
        layoutPriority: appMeetingLayout.priority,
        layoutGridSize: appMeetingLayout.gridSize,
        // recordingLayoutType,
        // recordingLayoutPriority,
        // recordingLayoutGridSize,
        hideLocalParticipant,
        alwaysShowOverlay,
        sideStackSize,
        reduceEdgeSpacing,
        isRecorder,
        maintainVideoAspectRatio,
        networkBarEnabled,

        // states
        sideBarMode,
        activeSortedParticipants,
        mainViewParticipants,
        overlaidInfoVisible,
        raisedHandsParticipants,
        userHasInteracted,
        whiteboardStarted,
        whiteboardState,
        meetingLayout,
        appMeetingLayout,
        canPin,
        meetingLeft,
        liveStreamConfig,
        meetingMode,
        downstreamUrl,
        optionArr,
        polls,
        draftPolls,
        sideBarNestedMode,
        hlsPlayerControlsVisible,
        createdPolls,
        endedPolls,
        submissions,
        afterMeetingJoinedHLSState,

        // setters
        setSideBarMode,
        setActiveSortedParticipants,
        setMainViewParticipants,
        setOverlaidInfoVisible,
        setRaisedHandsParticipants,
        setUserHasInteracted,
        setWhiteboardState,
        setMeetingLeft,
        setLiveStreamConfig,
        setAppMeetingLayout,
        setMeetingMode,
        setDownstreamUrl,
        setOptionArr,
        setDraftPolls,
        setSideBarNestedMode,
        setCreatedPolls,
        setEndedPolls,
        setSubmissions,
        setAfterMeetingJoinedHLSState,
      }}
    >
      <SnackbarProvider
        className={classes.container}
        autoHideDuration={5000}
        maxSnack={3}
        anchorOrigin={{
          vertical: isTab || isMobile ? "top" : "bottom",
          horizontal: "left",
        }}
      >
        {children}
      </SnackbarProvider>
    </MeetingAppContext.Provider>
  );
};
