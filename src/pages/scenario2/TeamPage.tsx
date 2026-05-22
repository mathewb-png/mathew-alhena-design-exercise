import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Mail,
  Shield,
  Crown,
  Eye,
  Copy,
  Check,
  UserPlus,
  ChevronRight,
  MessageSquare,
  Hash,
  Video,
} from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { clsx } from "clsx";
import { TopBar } from "../../components/layout/TopBar";
import { CollapsibleSection } from "../../components/layout/CollapsibleSection";
import { Toast } from "../../components/common/Toast";
import { useToast } from "../../hooks/useToast";
import { useOnboarding } from "../../context/OnboardingContext";

type RoleKey = "admin" | "editor" | "viewer";

const roleConfig: Record<RoleKey, { label: string; color: string; bg: string; description: string }> = {
  admin: {
    label: "Admin",
    color: "text-alhena-700",
    bg: "bg-alhena-50",
    description: "Full access to settings, integrations, and team management",
  },
  editor: {
    label: "Editor",
    color: "text-success-700",
    bg: "bg-success-50",
    description: "Manage AI behaviors, review escalations, and edit content",
  },
  viewer: {
    label: "Viewer",
    color: "text-surface-700",
    bg: "bg-surface-100",
    description: "Read-only access to dashboards and reports",
  },
};

interface SuggestedRole {
  id: string;
  role: string;
  description: string;
  permissionLevel: RoleKey;
  icon: typeof Shield;
}

const suggestedRoles: SuggestedRole[] = [
  {
    id: "cx_lead",
    role: "CX / Support Lead",
    description: "Monitor AI resolution, review escalations, and manage automation rules",
    permissionLevel: "editor",
    icon: Shield,
  },
  {
    id: "vp_ecom",
    role: "VP Ecommerce / Digital",
    description: "View weekly performance dashboards and revenue attribution",
    permissionLevel: "viewer",
    icon: Eye,
  },
  {
    id: "csm",
    role: "Alhena CSM",
    description: "Your dedicated account manager for optimization and launch support",
    permissionLevel: "editor",
    icon: Crown,
  },
];

export function TeamPage() {
  const toast = useToast();
  const { teamMembers: members, inviteMember } = useOnboarding();
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<RoleKey>("viewer");
  const [inviteLabel, setInviteLabel] = useState("");
  const [copied, setCopied] = useState(false);
  const [inviteHighlight, setInviteHighlight] = useState(false);
  const inviteRef = useRef<HTMLInputElement>(null);

  const handleCopyLink = () => {
    setCopied(true);
    toast.show("Invite link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = useCallback(() => {
    if (!inviteEmail.trim()) {
      toast.show("Please enter an email address");
      return;
    }
    if (!inviteEmail.includes("@")) {
      toast.show("Please enter a valid email address");
      return;
    }

    inviteMember(inviteEmail, inviteRole);
    toast.show(`Invitation sent to ${inviteEmail}`);
    setInviteEmail("");
    setInviteLabel("");
  }, [inviteEmail, inviteRole, toast, inviteMember]);

  const handleSuggestedInvite = useCallback(
    (suggested: SuggestedRole) => {
      setInviteRole(suggested.permissionLevel);
      setInviteLabel(suggested.role);
      setInviteEmail("");

      setInviteHighlight(true);
      setTimeout(() => setInviteHighlight(false), 1200);

      requestAnimationFrame(() => {
        inviteRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => inviteRef.current?.focus(), 400);
      });
    },
    []
  );

  const filledSuggestedIds = new Set<string>();
  members.forEach((m) => {
    if (m.status === "invited") {
      const match = suggestedRoles.find((s) => s.permissionLevel === m.role);
      if (match && !filledSuggestedIds.has(match.id)) {
        filledSuggestedIds.add(match.id);
      }
    }
  });

  return (
    <div className="space-y-6">
      <TopBar
        title="Team"
        subtitle="Build your team to get the most from Alhena"
        showActions={false}
      />

      {/* Section 1: Unified team roster */}
      <CollapsibleSection
        title="Your Team"
        titleRight={<span>{members.length} member{members.length !== 1 ? "s" : ""}</span>}
      >
        <div className="space-y-2">
          {/* Active/invited members */}
          {members.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-surface-0 rounded-2xl border border-surface-200 px-5 py-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-alhena-50 flex items-center justify-center text-xs font-bold text-alhena-700 shrink-0">
                {member.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[0.875rem] font-semibold text-surface-900">
                    {member.name}
                  </p>
                  {member.status === "invited" && (
                    <span className="text-xs font-medium text-warning-600 bg-warning-50 px-2 py-0.5 rounded-full">
                      Pending
                    </span>
                  )}
                </div>
                <p className="text-[0.875rem] text-surface-500 truncate">{member.email}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={clsx(
                    "text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full",
                    roleConfig[member.role].color,
                    roleConfig[member.role].bg
                  )}
                >
                  {roleConfig[member.role].label}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Suggested roles as empty slots */}
          {suggestedRoles.map((suggested, i) => {
            const alreadyInvited = members.some(
              (m) =>
                m.status === "invited" &&
                m.role === suggested.permissionLevel &&
                filledSuggestedIds.has(suggested.id)
            );
            if (alreadyInvited) return null;

            const config = roleConfig[suggested.permissionLevel];

            return (
              <motion.div
                key={suggested.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (members.length + i) * 0.04 }}
                className="rounded-2xl border border-dashed border-surface-300 bg-surface-50/50 px-5 py-4 flex items-center gap-4 group hover:border-alhena-300 hover:bg-surface-0 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-surface-100 flex items-center justify-center shrink-0 group-hover:bg-alhena-50 transition-colors">
                  <suggested.icon
                    size={18}
                    className="text-surface-400 group-hover:text-alhena-500 transition-colors"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.875rem] font-semibold text-surface-700">
                    {suggested.role}
                  </p>
                  <p className="text-[0.875rem] text-surface-500">
                    {suggested.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={clsx(
                      "text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full",
                      config.color,
                      config.bg
                    )}
                  >
                    {config.label}
                  </span>
                  <button
                    onClick={() => handleSuggestedInvite(suggested)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.875rem] font-semibold text-alhena-500 bg-alhena-50 hover:bg-alhena-100 hover:text-alhena-600 transition-all"
                  >
                    <UserPlus size={14} />
                    Invite
                    <ChevronRight size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CollapsibleSection>

      {/* Section 2: Invite form */}
      <CollapsibleSection title="Send an Invite">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={clsx(
            "rounded-2xl border p-6 transition-all duration-500",
            inviteHighlight
              ? "border-alhena-300 bg-alhena-50/30 shadow-sm shadow-alhena-100"
              : "border-surface-200 bg-surface-0"
          )}
        >
          <AnimatePresence>
            {inviteLabel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 overflow-hidden"
              >
                <p className="text-[0.875rem] text-alhena-600 font-medium">
                  Inviting: {inviteLabel}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
            <input
              ref={inviteRef}
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              placeholder={
                inviteLabel
                  ? `Enter email for ${inviteLabel}`
                  : "colleague@company.com"
              }
              className="flex-1 px-4 py-2.5 rounded-full border border-surface-200 bg-surface-0 text-[0.875rem] text-surface-900 placeholder:text-surface-400 focus:outline-none focus:border-alhena-300 focus:ring-2 focus:ring-alhena-100 transition-all"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as RoleKey)}
              className="px-4 py-2.5 rounded-full border border-surface-200 text-[0.875rem] text-surface-700 focus:outline-none focus:border-alhena-300 bg-surface-0 cursor-pointer"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={handleInvite}
              className="px-5 py-2.5 rounded-full bg-alhena-500 text-white text-[0.875rem] font-semibold hover:bg-alhena-600 transition-colors flex items-center gap-2"
            >
              <Mail size={14} />
              Send Invite
            </button>
          </div>

          {inviteRole && (
            <p className="mt-2 text-xs text-surface-500 pl-4">
              {roleConfig[inviteRole].description}
            </p>
          )}

          <div className="mt-4 pt-4 border-t border-surface-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[0.875rem] font-medium text-surface-700">Or share an invite link</p>
              <button
                onClick={handleCopyLink}
                className={clsx(
                  "flex items-center gap-1.5 text-[0.875rem] font-medium px-4 py-2 rounded-full transition-all",
                  copied
                    ? "bg-success-50 text-success-600"
                    : "bg-surface-50 text-surface-700 hover:bg-surface-100"
                )}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied!" : "Copy invite link"}
              </button>
            </div>
            <div className="bg-surface-50 rounded-lg px-3 py-2 flex items-center gap-3">
              <code className="text-xs text-surface-500 flex-1 truncate">
                https://app.alhena.ai/invite/bloom-co-a7x9k2
              </code>
              <div className="flex items-center gap-3 shrink-0 text-xs text-surface-500">
                <span>Grants <strong className="text-surface-700">{roleConfig[inviteRole].label}</strong> access</span>
                <span className="w-1 h-1 rounded-full bg-surface-300" />
                <span>Expires in 7 days</span>
              </div>
            </div>
          </div>
        </motion.div>
      </CollapsibleSection>

      {/* Team communication platform */}
      <TeamCommsSection toast={toast} />

      <Toast message={toast.message} visible={toast.visible} onClose={toast.hide} />
    </div>
  );
}

const commsPlatforms = [
  { id: "slack", name: "Slack", icon: Hash, description: "Get Alhena alerts and weekly summaries in your Slack channels" },
  { id: "teams", name: "Microsoft Teams", icon: MessageSquare, description: "Receive notifications and share reports in Teams channels" },
  { id: "zoom", name: "Zoom Chat", icon: Video, description: "Post automated updates to Zoom Team Chat" },
] as const;

function TeamCommsSection({ toast }: { toast: { show: (msg: string) => void } }) {
  const [connectedPlatform, setConnectedPlatform] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = (platformId: string) => {
    const platform = commsPlatforms.find((p) => p.id === platformId);
    if (!platform) return;

    setConnecting(platformId);
    toast.show(`Connecting ${platform.name}...`);

    setTimeout(() => {
      setConnectedPlatform(platformId);
      setConnecting(null);
      toast.show(`${platform.name} connected - Alhena will post to #alhena-alerts`);
    }, 1500);
  };

  return (
    <CollapsibleSection title="Team Notifications">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-0 rounded-2xl border border-surface-200 overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-surface-100">
          <p className="text-sm text-surface-700">
            Connect your team's chat platform so Alhena can send alerts, weekly summaries, and action items where your team already works.
          </p>
        </div>

        <div className="divide-y divide-surface-100">
          {commsPlatforms.map((platform) => {
            const isConnected = connectedPlatform === platform.id;
            const isConnecting = connecting === platform.id;
            const Icon = platform.icon;

            return (
              <div
                key={platform.id}
                className={clsx(
                  "px-5 py-4 flex items-center gap-4 transition-all",
                  isConnected && "bg-success-50/50"
                )}
              >
                <div
                  className={clsx(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                    isConnected ? "bg-success-500 text-white" : "bg-surface-100 text-surface-600"
                  )}
                >
                  {isConnected ? <Check size={16} /> : <Icon size={16} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-surface-900">{platform.name}</p>
                  <p className="text-xs text-surface-500">{platform.description}</p>
                </div>
                {isConnected ? (
                  <span className="text-xs font-medium text-success-600 flex items-center gap-1.5 shrink-0">
                    <Check size={12} />
                    Connected
                  </span>
                ) : (
                  <button
                    onClick={() => handleConnect(platform.id)}
                    disabled={isConnecting || connectedPlatform !== null}
                    className={clsx(
                      "px-4 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0",
                      connectedPlatform !== null
                        ? "bg-surface-100 text-surface-400 cursor-not-allowed"
                        : isConnecting
                          ? "bg-alhena-100 text-alhena-500"
                          : "bg-alhena-500 text-white hover:bg-alhena-600"
                    )}
                  >
                    {isConnecting ? "Connecting..." : "Connect"}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {connectedPlatform && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="px-5 py-3 bg-surface-50 border-t border-surface-100"
          >
            <p className="text-xs text-surface-600">
              Alhena will post to <strong className="text-surface-800">#alhena-alerts</strong> for critical issues and <strong className="text-surface-800">#alhena-weekly</strong> for performance summaries. You can customize channels after launch.
            </p>
          </motion.div>
        )}
      </motion.div>
    </CollapsibleSection>
  );
}
