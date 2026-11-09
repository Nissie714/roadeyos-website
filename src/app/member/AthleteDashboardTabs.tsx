"use client";

import { useState } from "react";
import ProfileNameForm from "@/components/ProfileNameForm";
import ClassBookingManager from "./ClassBookingManager";
import AthleteNotifications from "./AthleteNotifications";
import InstructorPasswordForm from "../instructor/InstructorPasswordForm";

type DashboardTab = "details" | "bookings" | "calendar" | "notifications";

const tabs: Array<{ id: DashboardTab; label: string }> = [
  { id: "details", label: "Your details" },
  { id: "bookings", label: "Upcoming bookings" },
  { id: "calendar", label: "Live class calendar" },
  { id: "notifications", label: "Class updates" },
];

export default function AthleteDashboardTabs() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("calendar");

  return (
    <div className="mt-9">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Athlete account sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`athlete-panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full border px-4 py-2.5 text-xs font-black uppercase tracking-wide transition sm:px-5 ${activeTab === tab.id ? "border-pink bg-pink text-white" : "border-white/15 bg-white/[.03] text-white/60 hover:border-pink/60 hover:text-white"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div id={`athlete-panel-${activeTab}`} role="tabpanel" className="mt-2">
        {activeTab === "details" && (
          <>
            <ProfileNameForm />
            <InstructorPasswordForm />
            <section className="mt-8 rounded-[2rem] border border-white/10 bg-[#101010] p-6">
              <p className="text-xs font-black uppercase tracking-widest text-pink">Cancellation policy</p>
              <p className="mt-4 text-sm leading-6 text-white/55">
                Group bookings require 12 hours&apos; notice. Contact Road-e-yo&apos;s directly if you need help with a late cancellation.
              </p>
            </section>
          </>
        )}
        {activeTab === "bookings" && <ClassBookingManager view="upcoming" />}
        {activeTab === "calendar" && <ClassBookingManager view="calendar" />}
        {activeTab === "notifications" && <AthleteNotifications />}
      </div>
    </div>
  );
}
