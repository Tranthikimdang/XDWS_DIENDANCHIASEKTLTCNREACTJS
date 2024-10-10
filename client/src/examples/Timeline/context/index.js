/* eslint-disable react/prop-types */
/**
  This file is used for controlling the dark and light state of the TimelineList and TimelineItem.
*/

import { createContext, useContext } from "react";

// The Timeline main src/context
const Timeline = createContext();

// Timeline src/context provider
function TimelineProvider({ children, value }) {
  return <Timeline.Provider value={value}>{children}</Timeline.Provider>;
}

// Timeline custom hook for using src/context
function useTimeline() {
  return useContext(Timeline);
}

export { TimelineProvider, useTimeline };
/* eslint-enable react/prop-types */
