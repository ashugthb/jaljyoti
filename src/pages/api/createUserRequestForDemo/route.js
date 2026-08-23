import { NextResponse } from "next/server";
import { getAdminEmail, getCustomerEmail } from "@/app/utils/emailTemplates";
import { connect } from "@/app/utils/mongodb";
import transporter from "@/app/utils/mail";
import { rateLimiter } from "@/app/utils/rateLimiter";

import DemoRequest from "@/model/DemoRequest";

import { DemoRequestSchema } from "@/validator/demoRequest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    // Rate Limit

    const forwardedFor = request.headers.get("x-forwarded-for");

    const ip = forwardedFor
      ? forwardedFor.split(",")[0].trim()
      : request.headers.get("x-real-ip") || "anonymous";

    const { success } = await rateLimiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "Too many requests. Please try again later.",
        },
        {
          status: 429,
        },
      );
    }
    // Parse Body

    const body = await request.json();

    // Validate

    const parsed = DemoRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          errors: parsed.error.flatten().fieldErrors,
        },
        {
          status: 400,
        },
      );
    }

    const { name, email, contact, companyName } = parsed.data;
    // Connect MongoDB

    await connect();

    // Duplicate Check

    const existing = await DemoRequest.findOne({
      email,
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "A demo request already exists for this email.",
        },
        {
          status: 409,
        },
      );
    }

    // Create Record
    const demo = await DemoRequest.create({
      name,
      email,
      contact,
      companyName,
    });

    // Send admin Email

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: process.env.DEMO_EMAIL,

      replyTo: email,

      subject: "New Demo Request",

      html: getAdminEmail({
        name,
        email,
        contact,
        companyName,
      }),
    });
    //send acknowledgment to the customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: email,

      subject: "We've received your demo request",

      html: getCustomerEmail({
        name,
        companyName,
      }),
    });
    // Update Status
    demo.emailSent = true;

    await demo.save();

    // Response

    return NextResponse.json({
      success: true,
      message: "Demo request submitted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
