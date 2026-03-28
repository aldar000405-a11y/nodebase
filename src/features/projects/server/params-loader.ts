import { createLoader } from "nuqs/server";
import { projectsParams } from "../params.server";

export const projectsParamsLoader = createLoader(projectsParams);
