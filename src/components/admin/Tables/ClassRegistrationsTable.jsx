import React from "react";
import Skeleton from "../../ui/skeleton";

export default function ClassRegistrationsTable({ data, loading, onRowClick }) {
  if (loading) {
    return (
      <div className="bg-white/90 rounded-xl shadow-lg border overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead>
            <tr className="bg-gradient-to-r from-blue-50 via-pink-50 to-blue-100">
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr key={index}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Skeleton className="h-6 w-16" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Skeleton className="h-6 w-32" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Skeleton className="h-6 w-24" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Skeleton className="h-6 w-40" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Skeleton className="h-6 w-20" />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Skeleton className="h-6 w-20" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="bg-white/90 rounded-xl shadow-lg border overflow-x-auto">
      <table className="w-full min-w-[1000px]">
        <thead>
          <tr className="bg-gradient-to-r from-blue-50 via-pink-50 to-blue-100">
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Student Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((reg) => (
            <tr
              key={reg.id}
              className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50 transition-all duration-200 cursor-pointer hover:shadow-md"
              onClick={() => onRowClick && onRowClick(reg)}
            >
              <td className="px-4 py-4 whitespace-nowrap font-medium">
                {reg.id}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span className="font-semibold text-blue-700">
                  {reg.full_name}
                </span>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                {reg.phone_number}
              </td>
              <td className="px-4 py-4 whitespace-nowrap text-gray-600">
                {reg.email}
              </td>
              <td className="px-4 py-4 whitespace-nowrap font-semibold text-green-600">
                ₹{reg.amount}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    reg.status === "success"
                      ? "bg-green-100 text-green-800"
                      : reg.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {reg.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
