import { Router } from "express";
import PacienteController from "../controllers/pacienteController.js";
import { authenticate, requireRole } from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", PacienteController.list);
router.get("/:id", PacienteController.getById);
router.post("/", authenticate, requireRole(["admin"]), PacienteController.create);
router.put("/:id", authenticate, requireRole(["admin"]), PacienteController.update);
router.delete("/:id", authenticate, requireRole(["admin"]), PacienteController.remove);

export default router;
