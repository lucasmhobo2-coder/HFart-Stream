import { Router, type IRouter } from "express";
import healthRouter from "./health";
import streamsRouter from "./streams";
import creatorsRouter from "./creators";
import chatRouter from "./chat";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/streams", streamsRouter);
router.use("/creators", creatorsRouter);
router.use("/chat", chatRouter);

export default router;
