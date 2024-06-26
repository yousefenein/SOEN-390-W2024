// Filename: CreateRequest.ts
// Author: Samuel Collette, Barthan
// Description: Backend query to createRequests and to view all available requests
// Dependencies: jwt, prisma, express

import express from "express";
const router = express.Router();
import prisma from "../prisma/client";
import jwt from "jsonwebtoken";
import verifyToken from "../middleware/verify-token";
require("dotenv").config();

import { Request, Response, NextFunction } from "express";
import  {priority}  from "@prisma/client";
import {request_status} from "@prisma/client";

interface requests {
  id: number;
  title: string;
  description: string;
  request_priority: string;
  issued_at: Date;
  condo_owner_id: number;
  employee_id: number;
  date_needed: Date;
  property_id: number;
  status: request_status;
  
}

// Route to handle the submission of a new listing
router.post(
  "/",
  verifyToken,
  async function (req: Request, res: Response, next: NextFunction) {
    try {
      jwt.verify(
        req.token as string,
        process.env.SECRET as jwt.Secret,
        async (err, decoded) => {
          if (err) {
            return res.status(401).json("Unauthorized");
          } else {
            console.log("decoded ---- ", decoded);
            const { id, role, email } = (<any>decoded).data;

            if (role === "publicUser") {
              const body = req.body; //constant
              console.log("body is ---- ", body);

              async function createRequest(
                property_id: number,
                // employee_id:number , //has to be null
                company_id: number,
                requestType: string,
                //date: Date,
                requestReason: string,
                priority: priority,
              ) {
                const property = await prisma.requests.create({
                  data: {
                    property_id: property_id,
                    title: requestType, //title = reason of request change to what the front end sends us in body
                    //issued_at: new Date(),
                    //date_needed: "2002/05/24",
                    condo_owner_id: company_id,
                    // employee_id: 2,
                    description: requestReason, //change to what the front end sends us in body
                    request_priority: priority, //change to what the front end sends us in body
                  },
                });
              }
              let request_priority: priority = priority.low;
              if (body.request_priority === "low") {
                request_priority = priority.low;
              } else if (body.request_priority === "high") {
                request_priority = priority.high;
              } else if (body.request_priority === "medium") {
                request_priority = priority.medium;
              }

              await createRequest(
                parseInt(body.propertyId),
                id,
                body.requestType,
                body.requestReason,
                request_priority,
              ); //async funtion

              console.log("a");
              return res.status(200).json({});
            }
            return res.status(500).json({
              message: "unexpected error",
            });
          }
        },
      );
    } catch (err) {
      return res.status(500).json({
        message: "unexpected error",
      });
    }
  },
);


router.get("/viewRequests", verifyToken, async (req: Request, res: Response) => {
  try {

    jwt.verify(
      req.token as string,
      process.env.SECRET as jwt.Secret,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json("Unauthorized");
        } else {
          console.log("decoded ---- ", decoded);
          const { id, role, email } = (<any>decoded).data;

          if (role === "company"){
            const requestList = await prisma.$queryRaw<
            requests[]
            >`select r.*, p.address
            from requests as r, property as p
            where r.property_id = p.id and p.company_id = ${id}
            `;
            res.json(requestList);
            console.log(requestList);
          } else if (role === "publicUser"){
            const requestList = await prisma.$queryRaw<
            requests[]
            >`select r.*, p.address
            from requests as r, property as p
            where condo_owner_id = ${id} and r.property_id = p.id
            `;
            res.json(requestList);
            console.log(requestList);
          }
          
  }});
  } catch (error) {
    console.error('Failed to get requests:', error);
    res.status(500).send('Error fetching requests');
  }
});

router.get("/viewRequests/:requestID", verifyToken, async (req: Request, res: Response) => {
  try {

    jwt.verify(
      req.token as string,
      process.env.SECRET as jwt.Secret,
      async (err, decoded) => {
        if (err) {
          return res.status(401).json("Unauthorized");
        } else {
          console.log("decoded ---- ", decoded);
          const { id, role, email } = (<any>decoded).data;
          const body = req.body;
          const request = await prisma.requests.findFirst({
            where: {
              id: body.requestID

            },
          });
          res.json(request);
          console.log(request);

          
  }});
  } catch (error) {
    console.error('Failed to get requests:', error);
    res.status(500).send('Error fetching requests');
  }
});

router.patch(
  "/update-request",
  verifyToken,
  async (req, res) => {
    try {
      const { requestId, employeeId, newStatus } = req.body;
      const request = await prisma.requests.findUnique({ where: { id: requestId } });

      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      // If assigning to an employee
      if (employeeId) {
        const employee = await prisma.employee_users.findUnique({ where: { user_id: parseInt(employeeId) } });
        if (!employee) {
          return res.status(404).json({ message: "Employee not found" });
        }
        // Update request to in_progress and set employee
        await prisma.requests.update({
          where: { id: requestId },
          data: { employee_id: parseInt(employeeId), status: 'in_progress' }
        });
      }

      // If marking as completed, no need for an employee check
      if (newStatus === 'completed') {
        await prisma.requests.update({
          where: { id: requestId },
          data: { status: 'completed' }
        });
      }

      return res.status(200).json({ message: "Request updated successfully" });
    } catch (err) {
      console.error("Error updating request:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);


export default router;
