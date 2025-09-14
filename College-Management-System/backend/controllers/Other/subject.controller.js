const Subject = require("../../models/Other/subject.model");

const getSubject = async (req, res) => {
    try {
        let subject = await Subject.find();
        if (!subject) {
            return res
                .status(400)
                .json({ success: false, message: "No Subject Available" });
        }
        const data = {
            success: true,
            message: "All Subject Loaded!",
            subject,
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getSUbjectbranchandsem = async (req, res) => {
    try {
        const { offering_branch, semester } = req.query; // Extract query parameters
        
        let query = {}; // Default: Empty query to fetch all subjects

        // If branch and semester are provided, filter based on them
        if (offering_branch && semester) {
            query = { offering_branch, semester };
        }

        
        // Fetch subjects based on query
        const subjects = await Subject.find(query);

        if (!subjects || subjects.length === 0) {
            return res.json({ success: false, message: "No subjects found" });
        }

        res.json({ success: true, message: "Subjects Loaded!", subject: subjects });

    } catch (error) {
        console.error(error.message);
        res.json({ success: false, message: "Internal Server Error" });
    }
};


const addSubject = async (req, res) => {
    let { name, code, offering_branch , semester } = req.body;
    try {
        let subject = await Subject.findOne({ code });
        if (subject) {
            return res
                .status(400)
                .json({ success: false, message: "Subject Already Exists" });
        }
        await Subject.create({
            name,
            code,
            offering_branch,
            semester,
        });
        const data = {
            success: true,
            message: "Subject Added!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const deleteSubject = async (req, res) => {
    try {
        let subject = await Subject.findByIdAndDelete(req.params.id);
        if (!subject) {
            return res
                .status(400)
                .json({ success: false, message: "No Subject Exists!" });
        }
        const data = {
            success: true,
            message: "Subject Deleted!",
        };
        res.json(data);
    } catch (error) {
        console.error(error.message);
        console.log(error)
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getSubjectsBySemAndBranch = async (req, res) => {
    const { semester, branch } = req.query; 
    try {
        const subjects = await Subject.find({ semester, offering_branch: branch });

        if (!subjects || subjects.length === 0) {
            return res.status(404).json({ success: false, message: "No subjects found" });
        }

        res.json({ success: true, message: "Subjects Loaded!", subjects });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getSubjectsByBranch = async (req, res) => {
    const { branch } = req.query; 
    try {
        const subjects = await Subject.find({ offering_branch: branch });

        if (!subjects || subjects.length === 0) {
            return res.status(404).json({ success: false, message: "No subjects found" });
        }

        res.json({ success: true, message: "Subjects Loaded!", subjects });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
module.exports = { getSubject, getSUbjectbranchandsem, addSubject, deleteSubject, getSubjectsBySemAndBranch, getSubjectsByBranch }