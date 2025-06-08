const express = require("express");
const router = express.Router();
const { Project } = require("../models/Project");
const { Organization } = require("../models/Organization");
const { User } = require("../models/User");
const { where } = require("sequelize");

router.post("/create-project", async (req, res) => {
  try {
    const {
      name,
      organization_id,
      owner_id,
      status,
      type,
      description,
      start_date,
      end_date
    } = req.body;
    if (!name || !organization_id || !owner_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const isOrganization = await Organization.findOne({ where: { id: organization_id } });
    if (!isOrganization) {
      return res.status(404).json({ error: "Organization not found" });
    }
    const isOwner = await User.findOne({where:{id: owner_id}});
        if (!isOwner){
            return res.status(404).json({
                status: "error",
                message: "Owner not found"
            });
        }
    const newProject = await Project.create({
      name,
      organization_id,
      owner_id,
      status: status || "active",
      type: type || "internal",
      description: description || "",
      start_date: start_date || new Date(),
      end_date: end_date || null
    });

    return res.status(201).json({
      status: "success",
      message: "Project created successfully",
      data: newProject
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/get-projects/:owner_id", async (req, res) => {
    try{
        const { owner_id} = req.params;
        if (!owner_id) {
            return res.status(400).json({ error: "Project ID is required" });
        }
        const projects = await Project.findAll({where:{owner_id: owner_id}});
        return res.status(200).json({
            status: "success",
            message: "Projects retrieved successfully",
            data: projects
        });
    
    }catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

module.exports = router;
