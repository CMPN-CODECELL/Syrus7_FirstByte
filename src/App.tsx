
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  ArrowLeftRight,
  GraduationCap,
  Bell,
  Search,
  Menu,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Community", icon: Users },
  { name: "Resources", icon: BookOpen },
  { name: "Campus Exchange", icon: ArrowLeftRight },
  { name: "Study Groups", icon: GraduationCap },
];

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white p-6 md:block">
        {/* CampusOS logo */}
        <div className="mb-10 flex items-center gap-3">
          <img
            src="/campusos.jpg"
            alt="CampusOS logo"
            className="h-11 w-11 rounded-xl object-contain"
          />

          <div>
            <h1 className="text-xl font-bold">CampusOS</h1>
            <p className="text-xs text-slate-500">
              Connect. Learn. Grow.
            </p>
          </div>
        </div>

        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Workspace
        </p>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.name;

            return (
              <button
                key={item.name}
                onClick={() => setActivePage(item.name)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={19} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-indigo-50 p-4">
          <p className="font-semibold text-indigo-900">
            Campus life, connected.
          </p>
          <p className="mt-1 text-sm text-indigo-700">
            Your campus community starts here.
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur sm:px-8">
          <div className="flex items-center gap-3">
            <button
              aria-label="Menu"
              className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-sm text-slate-500">
                Your campus space
              </p>
              <h2 className="text-lg font-bold">{activePage}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Search"
              className="rounded-full p-2.5 text-slate-600 hover:bg-slate-100"
            >
              <Search size={20} />
            </button>

            <button
              aria-label="Notifications"
              className="rounded-full p-2.5 text-slate-600 hover:bg-slate-100"
            >
              <Bell size={20} />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
              S
            </div>
          </div>
        </header>

        {/* Dashboard body */}
        <div className="mx-auto max-w-7xl p-5 sm:p-8">
          {/* Welcome banner */}
          <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 p-7 text-white sm:p-10">
            <p className="mb-3 text-sm font-medium text-indigo-100">
              YOUR CAMPUS. YOUR COMMUNITY.
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Welcome to CampusOS 👋
            </h1>

            <p className="mt-3 max-w-xl leading-7 text-indigo-100">
              Connect with fellow students, discover useful resources,
              exchange what you need, and learn together.
            </p>

            <button
              onClick={() => setActivePage("Community")}
              className="mt-6 rounded-xl bg-white px-5 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-50"
            >
              Explore your campus
            </button>
          </section>

          {/* Feature cards */}
          <section className="mt-9">
            <h2 className="text-xl font-bold">
              Your campus at a glance
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Everything you need, all in one place.
            </p>

            <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Community",
                  description: "Meet students and join conversations.",
                  icon: Users,
                  color: "bg-blue-100 text-blue-700",
                },
                {
                  title: "Resources",
                  description: "Discover notes and study materials.",
                  icon: BookOpen,
                  color: "bg-emerald-100 text-emerald-700",
                },
                {
                  title: "Campus Exchange",
                  description: "Share and discover campus essentials.",
                  icon: ArrowLeftRight,
                  color: "bg-amber-100 text-amber-700",
                },
                {
                  title: "Study Groups",
                  description: "Learn and prepare together.",
                  icon: GraduationCap,
                  color: "bg-violet-100 text-violet-700",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.title}
                    onClick={() => setActivePage(item.title)}
                    className="rounded-2xl border border-slate-200 bg-white p-5 text-left transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                  >
                    <div
                      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
                    >
                      <Icon size={23} />
                    </div>

                    <h3 className="font-bold">{item.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.description}
                    </p>

                    <p className="mt-4 text-sm font-semibold text-indigo-600">
                      Explore →
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Activity sections */}
          <section className="mt-9 grid gap-5 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-bold">Recent activity</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Community posts and campus updates will appear here
                when we connect the backend.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-lg font-bold">Study corner</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Shared notes, study groups, and learning resources
                will appear here soon.
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-8 text-center text-sm text-slate-400">
            CampusOS · Connect. Learn. Exchange. Grow.
          </footer>
        </div>
      </main>
    </div>
  );
}