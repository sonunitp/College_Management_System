const express = require("express");
const { getSubject,getSUbjectbranchandsem, addSubject, deleteSubject, getSubjectsBySemAndBranch, getSubjectsByBranch } = require("../../controllers/Other/subject.controller");
const router = express.Router();

router.get("/getSubject", getSubject);
router.get("/getSubjectbranchandsem" , getSUbjectbranchandsem)
router.post("/addSubject", addSubject);
router.delete("/deleteSubject/:id", deleteSubject);
router.get("/getSubjectsBySemAndBranch", getSubjectsBySemAndBranch);
router.get("/getSubjectsByBranch", getSubjectsByBranch);

module.exports = router;