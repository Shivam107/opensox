"use client";
import React from "react";
import { useProjectTitleStore } from "@/store/useProjectTitleStore";
import Dashboard from "../page";
import { useProjectsData } from "@/store/useProjectsDataStore";
import { useRenderProjects } from "@/store/useRenderProjectsStore";
import { projectsOfTheWeek } from "@/utils/config";
import { useEffect } from "react";

const Home = () => {
  const { setRenderProjects } = useRenderProjects();
  const { setData } = useProjectsData();
  const { setProjectTitle } = useProjectTitleStore();

  useEffect(() => {
    const initializeState = () => {
      setData(projectsOfTheWeek);
      setRenderProjects(true);
      setProjectTitle("Projects of the week");
    };

    initializeState();
  }, [setData, setRenderProjects, setProjectTitle]);

  return <Dashboard />;
};

export default Home;
