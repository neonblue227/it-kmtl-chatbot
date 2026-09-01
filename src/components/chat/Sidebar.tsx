"use client";

import { useState } from "react";
import {
  ChevronDown,
  LogOut,
  MessageSquare,
  PanelLeftClose,
  Plus,
  Settings,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useT } from "@/hooks/useT";
import { useAppStore } from "@/lib/store";
import type { ChatSession } from "@/lib/store";
import { Avatar } from "@/components/ui/Avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";

interface Props {
  onNewChat: () => void;
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function Sidebar({ onNewChat, sessions, activeId, onSelect, onDelete }: Props) {
  const t = useT();
  const router = useRouter();
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const [open, setOpen] = useState<Record<string, boolean>>({
    profile: true,
    settings: true,
  });

  function logout() {
    setProfile({ authed: false });
    router.push("/login");
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col gap-3 p-3">
      <div className="flex items-center justify-between rounded-xl bg-surface p-2.5 shadow-sm">
        <span className="text-sm font-semibold">{t.newChat}</span>
        <button
          onClick={onNewChat}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-foreground transition-colors hover:bg-accent-strong"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex flex-col gap-2.5 rounded-xl bg-surface p-2.5 shadow-sm">
        <MenuSection
          title={t.profile}
          icon={<User className="h-4 w-4" />}
          open={open.profile}
          onToggle={() => setOpen((o) => ({ ...o, profile: !o.profile }))}
        >
          <div className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5">
            <Avatar name={profile.fullName} size={28} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{profile.fullName}</p>
              <p className="truncate text-xs text-muted">@{profile.userName}</p>
            </div>
          </div>
        </MenuSection>

        <MenuSection
          title={t.language}
          icon={<MessageSquare className="h-4 w-4" />}
          open={open.settings}
          onToggle={() => setOpen((o) => ({ ...o, settings: !o.settings }))}
        >
          <div className="px-2 py-1">
            <LanguageToggle />
          </div>
        </MenuSection>

        <MenuSection
          title={t.settings}
          icon={<Settings className="h-4 w-4" />}
          open={open.settings}
          onToggle={() => setOpen((o) => ({ ...o, settings: !o.settings }))}
        >
          <div className="flex items-center justify-between px-2 py-1.5">
            <span className="text-sm text-muted">{t.themeLight}</span>
            <ThemeToggle />
          </div>
        </MenuSection>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-hidden rounded-xl bg-surface p-2.5 shadow-sm">
        <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted">
          <PanelLeftClose className="h-3.5 w-3.5" />
          {t.yourChats} ({sessions.length})
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto">
          {sessions.length === 0 && (
            <p className="px-2 py-1 text-xs text-muted">{t.emptyHistory}</p>
          )}
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`group flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                s.id === activeId
                  ? "bg-surface-muted text-foreground"
                  : "text-muted hover:bg-surface-muted hover:text-foreground"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1 truncate">{s.title || t.newChat}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(s.id);
                }}
                className="hidden text-muted opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
              >
                <Settings className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-2.5 rounded-xl bg-surface p-2.5 text-sm shadow-sm transition-colors hover:bg-surface-muted"
      >
        <Avatar name={profile.fullName} size={32} />
        <span className="flex-1 truncate text-left">{profile.fullName}</span>
        <LogOut className="h-4 w-4 text-muted" />
      </button>
    </aside>
  );
}

function MenuSection({
  title,
  icon,
  open,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-2 py-1.5 text-sm font-medium transition-colors hover:text-foreground"
      >
        {icon}
        <span className="flex-1 text-left">{title}</span>
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "" : "-rotate-90"}`}
        />
      </button>
      {open && <div className="mt-0.5">{children}</div>}
    </div>
  );
}
