"use client";

import { useRenderProjects } from "@/store/useRenderProjectsStore";
import Dashboard from "../page";
import { useEffect } from "react";
import { useProjectTitleStore } from "@/store/useProjectTitleStore";
import { useProjectsData } from "@/store/useProjectsDataStore";

const Projects = () => {
  const { setRenderProjects } = useRenderProjects();
  const { setProjectTitle } = useProjectTitleStore();
  const { setData } = useProjectsData();

  useEffect(() => {
    setRenderProjects(true); // Change to true to always render the container
    setProjectTitle("Projects");
    setData([]); // Clear any existing projects
  }, [setRenderProjects, setProjectTitle, setData]);

  return <Dashboard />;
};

export default Projects;
