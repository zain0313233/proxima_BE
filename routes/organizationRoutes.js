const express = require('express');
const router = express.Router();
const { Organization } = require('./../models/Organization');
const { User } = require('./../models/User');

router.post('/', async (req, res) => {
    try{
        const {name,owner_id,type,description,website_url,phone,address,status,updated_at,industry,max_members} = req.body;
        if (!name || !owner_id || !type || !phone || !address) {
            return res.status(400).json({
                status: "error",
                message: "Organization name and owner ID And Other Info Required"
            });

        }
     const owner= await User.findOne({where:{id: owner_id}});
        if (!owner){
            return res.status(404).json({
                status: "error",
                message: "Owner not found"
            });
        }

        const newOrganization = await Organization.create({
            name,
            owner_id,
            type,
            description: description || null,
            website: website_url || null,
            industry: industry || null,
            max_members: max_members || null,
            phone,
            address,
            status: status || 'active',
            created_at: new Date(),
            updated_at: updated_at || new Date()

        })

        return res.status(201).json({
            status: "success",
            message: "Organization created successfully",
            data: newOrganization
        });

    }catch (error) {
        console.error("Error creating organization:", error);
        return res.status(500).json({
            status: "error",
            message: "Internal server error"
        });
    }
}
);

router.get('/get-info/:owner_id',async (req,res)=>{
try{
const {owner_id}= req.params;
if(!owner_id){
    return res.status(400).json({
        status: "error",
        message: "Owner ID is required"
    });
}
const organization = await Organization.findOne({
    where: { owner_id: owner_id }
})
if (!organization) {
    return res.status(404).json({
        status: "error",
        message: "Organization not found"
    });
}
return res.status(200).json({
    status: "success",
    message: "Organization info retrieved successfully",
    data: organization
});
}catch(error) {
    console.error("Error fetching organization info:", error);
    return res.status(500).json({
        status: "error",
        message: "Internal server error"
    });
}
})

module.exports = router;