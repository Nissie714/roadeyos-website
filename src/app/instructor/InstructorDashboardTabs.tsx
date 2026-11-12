"use client";

import { useState } from "react";
import ProfileNameForm from "@/components/ProfileNameForm";
import InstructorBroadcast from "./InstructorBroadcast";
import InstructorPasswordForm from "./InstructorPasswordForm";
import InstructorRoster from "./InstructorRoster";
import MonthlyMembers from "./MonthlyMembers";
import EmergencyContacts from "./EmergencyContacts";

type InstructorTab = "details" | "push" | "classes" | "memberships" | "emergency";

const tabs: Array<{ id: InstructorTab; label: string }> = [
  { id: "details", label: "Your details" },
  { id: "push", label: "Notifications" },
  { id: "classes", label: "Classes" },
  { id: "memberships", label: "Monthly members" },
  { id: "emergency", label: "Emergency Contacts" },
];

export default function InstructorDashboardTabs() {
  const [activeTab, setActiveTab] = useState<InstructorTab>("classes");

  return (
    <div className="mt-9">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Instructor dashboard sections">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`instructor-panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full border px-4 py-2.5 text-xs font-black uppercase tracking-wide transition sm:px-5 ${activeTab === tab.id ? "border-pink bg-pink text-white" : "border-white/15 bg-white/[.03] text-white/60 hover:border-pink/60 hover:text-white"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div id={`instructor-panel-${activeTab}`} role="tabpanel" className="mt-2">
        {activeTab === "details" && (
          <>
            <ProfileNameForm />
            <InstructorPasswordForm />
          </>
        )}
        {activeTab === "push" && <InstructorBroadcast />}
        {activeTab === "classes" && <InstructorRoster />}
        {activeTab === "memberships" && <MonthlyMembers />}
        {activeTab === "emergency" && <EmergencyContacts />}
      </div>
    </div>
  );
}
