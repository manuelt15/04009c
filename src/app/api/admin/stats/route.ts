import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import { Order } from "@/lib/models/order";
import { Product } from "@/lib/models/product";
import { Subscriber } from "@/lib/models/subscriber";
import { requireAdmin } from "@/lib/auth/admin-guard";

export async function GET(req: NextRequest) {
  const denied = await requireAdmin(req);
  if (denied) return denied;

  try {
    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalRevenue, monthRevenue, activeOrders, soldOutCount,
      totalSubscribers, recentSubscribers, ordersByStatus,
      revenueByMonth, productsByCategory,
    ] = await Promise.all([
      Order.aggregate([{ $match: { status: "entregado" } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
      Order.aggregate([{ $match: { status: "entregado", createdAt: { $gte: startOfMonth } } }, { $group: { _id: null, total: { $sum: "$total" } } }]),
      Order.countDocuments({ status: { $in: ["pendiente", "confirmado", "enviado"] } }),
      Product.countDocuments({ soldOut: true }),
      Subscriber.countDocuments(),
      Subscriber.find().sort({ createdAt: -1 }).limit(5).lean(),
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { status: "entregado" } },
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, revenue: { $sum: "$total" } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
        { $limit: 6 },
      ]),
      Product.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    ]);

    return NextResponse.json({
      totalRevenue: totalRevenue[0]?.total ?? 0,
      monthRevenue: monthRevenue[0]?.total ?? 0,
      activeOrders, soldOutCount, totalSubscribers,
      recentSubscribers, ordersByStatus, revenueByMonth, productsByCategory,
    });
  } catch {
    return NextResponse.json({ error: "ERROR DE SERVIDOR" }, { status: 500 });
  }
}
