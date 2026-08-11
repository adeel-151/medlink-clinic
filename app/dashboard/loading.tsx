"use client";

import { motion } from "framer-motion";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded-lg mb-2" />
          <div className="h-4 w-64 bg-gray-100 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-xl" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-8 w-20 bg-gray-200 rounded-lg" />
                <div className="h-3 w-32 bg-gray-100 rounded" />
              </div>
              <div className="w-11 h-11 bg-gray-100 rounded-xl" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 h-64 flex flex-col justify-between">
            <div className="flex justify-between">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-16 bg-gray-100 rounded" />
            </div>
            <div className="w-full h-40 bg-gray-50 rounded-xl mt-4" />
          </div>
          
          <div className="bg-white border border-gray-100 rounded-2xl p-6 h-64 flex flex-col justify-between">
            <div className="h-4 w-32 bg-gray-200 rounded mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-48 bg-gray-200 rounded" />
                    <div className="h-2 w-24 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 h-80">
            <div className="flex justify-between mb-6">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-6 w-16 bg-gray-100 rounded" />
            </div>
            <div className="w-full h-56 bg-gray-50 rounded-xl" />
          </div>
          
          <div className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-50 rounded-xl w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
