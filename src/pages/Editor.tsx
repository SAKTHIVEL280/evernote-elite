import { useState, useCallback, useEffect, useRef, DragEvent, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered,
  Code, Link as LinkIcon, Image, Table, Quote, Minus, Download,
  Plus, Search, Trash2, FileText, Maximize, Minimize,
  ChevronLeft, ChevronRight, AlignLeft, FolderPlus, Folder,
  FolderOpen, GripVertical, MoreHorizontal, Pencil, Eye, EyeOff,
  PanelLeftClose, PanelLeft, Copy, ChevronDown, Pin, PinOff,
  Archive, ArchiveRestore, Tag, X, Command, FileCode, Printer,
  LayoutTemplate, BookOpen, CalendarDays, ListTodo, Briefcase,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

// ─── Types ────────────────────────────────────────────────────────

interface NoteFolder {
  id: string;
  name: string;
  order: number;
}

interface NoteTag {
  id: string;
  name: string;
  color: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  updatedAt: number;
  createdAt: number;
  order: number;
  pinned?: boolean;
  trashed?: boolean;
  trashedAt?: number;
  tags?: string[]; // tag ids
}

// ─── Helpers ──────────────────────────────────────────────────────

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function persist(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

const TAG_COLORS = [
  "hsl(210, 36%, 31%)", // navy
  "hsl(42, 52%, 56%)",  // gold
  "hsl(150, 40%, 40%)", // green
  "hsl(0, 60%, 55%)",   // red
  "hsl(270, 40%, 50%)", // purple
  "hsl(200, 60%, 50%)", // blue
  "hsl(30, 60%, 50%)",  // orange
  "hsl(340, 50%, 50%)", // pink
];

const DEFAULT_CONTENT = `# Welcome to PMNT

Start writing your markdown here. Use the toolbar above or keyboard shortcuts:

- **Bold**: Ctrl+B
- *Italic*: Ctrl+I
- [Links](https://example.com)
- \`inline code\`

## Features

1. Live split preview
2. Auto-save to local storage
3. Export as .md file
4. Zen mode for distraction-free writing

> "The scariest moment is always just before you start." — Stephen King

Happy writing! ✍️
`;

const TEMPLATES: { name: string; icon: typeof FileText; content: string }[] = [
  {
    name: "Meeting Notes",
    icon: Briefcase,
    content: `# Meeting Notes — {{date}}

## Attendees
- 

## Agenda
1. 

## Discussion Points


## Action Items
- [ ] 
- [ ] 

## Next Meeting

`,
  },
  {
    name: "Journal Entry",
    icon: BookOpen,
    content: `# Journal — {{date}}

## How I'm feeling


## Today's highlights


## Gratitude
1. 
2. 
3. 

## Tomorrow's intentions

`,
  },
  {
    name: "Project Plan",
    icon: CalendarDays,
    content: `# Project: [Name]

## Overview


## Goals
- 

## Timeline

| Phase | Start | End | Status |
| ----- | ----- | --- | ------ |
| Planning | | | 🟡 |
| Development | | | ⚪ |
| Testing | | | ⚪ |
| Launch | | | ⚪ |

## Resources needed


## Risks & mitigations

`,
  },
  {
    name: "To-Do List",
    icon: ListTodo,
    content: `# To-Do — {{date}}

## High Priority
- [ ] 

## Medium Priority
- [ ] 

## Low Priority
- [ ] 

## Done ✅

`,
  },
  {
    name: "Blank Note",
    icon: FileText,
    content: "",
  },
];

const toolbarActions = [
  { icon: Bold, label: "Bold", prefix: "**", suffix: "**", shortcut: "b" },
  { icon: Italic, label: "Italic", prefix: "*", suffix: "*", shortcut: "i" },
  { icon: Heading1, label: "H1", prefix: "# ", suffix: "", shortcut: "1" },
  { icon: Heading2, label: "H2", prefix: "## ", suffix: "", shortcut: "2" },
  { icon: Heading3, label: "H3", prefix: "### ", suffix: "", shortcut: "3" },
  { icon: List, label: "Bullet List", prefix: "- ", suffix: "", shortcut: "" },
  { icon: ListOrdered, label: "Numbered List", prefix: "1. ", suffix: "", shortcut: "" },
  { icon: Quote, label: "Quote", prefix: "> ", suffix: "", shortcut: "" },
  { icon: Code, label: "Code", prefix: "`", suffix: "`", shortcut: "" },
  { icon: LinkIcon, label: "Link", prefix: "[", suffix: "](url)", shortcut: "" },
  { icon: Image, label: "Image", prefix: "![alt](", suffix: ")", shortcut: "" },
  { icon: Table, label: "Table", prefix: "\n| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |\n", suffix: "", shortcut: "" },
  { icon: Minus, label: "Divider", prefix: "\n---\n", suffix: "", shortcut: "" },
];

// ─── Component ────────────────────────────────────────────────────

const Editor = () => {
  const [folders, setFolders] = useState<NoteFolder[]>(() => load("pmnt-folders", []));
  const [notes, setNotes] = useState<Note[]>(() => load("pmnt-notes-v2", []));
  const [tags, setTags] = useState<NoteTag[]>(() => load("pmnt-tags", []));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zenMode, setZenMode] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [mobileView, setMobileView] = useState<"sidebar" | "editor" | "preview">("sidebar");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renameNoteDialog, setRenameNoteDialog] = useState<{ id: string; title: string } | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [showTrash, setShowTrash] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0]);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templateFolderId, setTemplateFolderId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Migrate old notes
  useEffect(() => {
    if (notes.length === 0) {
      const oldNotes = load<any[]>("pmnt-notes", []);
      if (oldNotes.length > 0) {
        const migrated = oldNotes.map((n, i) => ({
          ...n,
          folderId: n.folderId ?? null,
          order: n.order ?? i,
          pinned: false,
          trashed: false,
          tags: [],
        }));
        setNotes(migrated);
        persist("pmnt-notes-v2", migrated);
      } else {
        const first: Note = {
          id: uid(),
          title: "Welcome",
          content: DEFAULT_CONTENT,
          folderId: null,
          updatedAt: Date.now(),
          createdAt: Date.now(),
          order: 0,
          pinned: false,
          trashed: false,
          tags: [],
        };
        setNotes([first]);
        setActiveId(first.id);
        persist("pmnt-notes-v2", [first]);
      }
    } else if (!activeId) {
      setActiveId(notes.filter(n => !n.trashed)[0]?.id || null);
    }
  }, []);

  // Record writing streak
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const streak: string[] = load("pmnt-writing-days", []);
    if (!streak.includes(today)) {
      const updated = [...streak, today];
      persist("pmnt-writing-days", updated);
    }
  }, [notes]);

  // Persist
  useEffect(() => { persist("pmnt-notes-v2", notes); }, [notes]);
  useEffect(() => { persist("pmnt-folders", folders); }, [folders]);
  useEffect(() => { persist("pmnt-tags", tags); }, [tags]);

  // Command palette shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const activeNote = notes.find((n) => n.id === activeId);

  // ─── Notes CRUD ─────────────────────────────────────────────────

  const updateNote = useCallback(
    (updates: Partial<Note>) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === activeId ? { ...n, ...updates, updatedAt: Date.now() } : n))
      );
    },
    [activeId]
  );

  const createNote = useCallback(
    (folderId: string | null = null, content: string = "", title: string = "Untitled") => {
      const note: Note = {
        id: uid(),
        title,
        content,
        folderId,
        updatedAt: Date.now(),
        createdAt: Date.now(),
        order: notes.length,
        pinned: false,
        trashed: false,
        tags: [],
      };
      setNotes((prev) => [note, ...prev]);
      setActiveId(note.id);
      if (folderId) setExpandedFolders((prev) => new Set(prev).add(folderId));
      if (isMobile) setMobileView("editor");
    },
    [notes.length, isMobile]
  );

  const createFromTemplate = useCallback(
    (template: typeof TEMPLATES[number], folderId: string | null) => {
      const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      const content = template.content.replace(/\{\{date\}\}/g, date);
      createNote(folderId, content, template.name === "Blank Note" ? "Untitled" : template.name);
      setTemplateDialogOpen(false);
    },
    [createNote]
  );

  const duplicateNote = useCallback(
    (id: string) => {
      const original = notes.find((n) => n.id === id);
      if (!original) return;
      const copy: Note = {
        ...original,
        id: uid(),
        title: `${original.title} (copy)`,
        updatedAt: Date.now(),
        createdAt: Date.now(),
        order: notes.length,
      };
      setNotes((prev) => [copy, ...prev]);
      setActiveId(copy.id);
    },
    [notes]
  );

  const trashNote = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const next = prev.map((n) =>
          n.id === id ? { ...n, trashed: true, trashedAt: Date.now() } : n
        );
        if (activeId === id) {
          const alive = next.filter(n => !n.trashed);
          setActiveId(alive[0]?.id || null);
        }
        return next;
      });
    },
    [activeId]
  );

  const restoreNote = useCallback(
    (id: string) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, trashed: false, trashedAt: undefined } : n))
      );
    },
    []
  );

  const permanentlyDeleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
    },
    []
  );

  const emptyTrash = useCallback(() => {
    setNotes((prev) => prev.filter((n) => !n.trashed));
  }, []);

  const togglePin = useCallback(
    (id: string) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
      );
    },
    []
  );

  const moveNoteToFolder = useCallback(
    (noteId: string, folderId: string | null) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, folderId, updatedAt: Date.now() } : n))
      );
    },
    []
  );

  // ─── Tags CRUD ─────────────────────────────────────────────────

  const createTag = useCallback(() => {
    if (!newTagName.trim()) return;
    const tag: NoteTag = { id: uid(), name: newTagName.trim(), color: newTagColor };
    setTags((prev) => [...prev, tag]);
    setNewTagName("");
    setTagDialogOpen(false);
  }, [newTagName, newTagColor]);

  const deleteTag = useCallback(
    (tagId: string) => {
      setTags((prev) => prev.filter((t) => t.id !== tagId));
      setNotes((prev) =>
        prev.map((n) => ({
          ...n,
          tags: (n.tags || []).filter((t) => t !== tagId),
        }))
      );
      if (filterTag === tagId) setFilterTag(null);
    },
    [filterTag]
  );

  const toggleNoteTag = useCallback(
    (noteId: string, tagId: string) => {
      setNotes((prev) =>
        prev.map((n) => {
          if (n.id !== noteId) return n;
          const current = n.tags || [];
          return {
            ...n,
            tags: current.includes(tagId)
              ? current.filter((t) => t !== tagId)
              : [...current, tagId],
            updatedAt: Date.now(),
          };
        })
      );
    },
    []
  );

  // ─── Folders CRUD ───────────────────────────────────────────────

  const createFolder = useCallback(() => {
    if (!newFolderName.trim()) return;
    const folder: NoteFolder = { id: uid(), name: newFolderName.trim(), order: folders.length };
    setFolders((prev) => [...prev, folder]);
    setExpandedFolders((prev) => new Set(prev).add(folder.id));
    setNewFolderName("");
    setFolderDialogOpen(false);
  }, [newFolderName, folders.length]);

  const renameFolder = useCallback(
    (id: string, name: string) => {
      setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
      setEditingFolderId(null);
    },
    []
  );

  const deleteFolder = useCallback(
    (id: string) => {
      setFolders((prev) => prev.filter((f) => f.id !== id));
      setNotes((prev) => prev.map((n) => (n.folderId === id ? { ...n, folderId: null } : n)));
    },
    []
  );

  const toggleFolder = useCallback((id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // ─── Drag & Drop ───────────────────────────────────────────────

  const handleNoteDragStart = (e: DragEvent, noteId: string) => {
    e.dataTransfer.setData("note-id", noteId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleFolderDrop = (e: DragEvent, folderId: string | null) => {
    e.preventDefault();
    setDragOverTarget(null);
    const noteId = e.dataTransfer.getData("note-id");
    if (noteId) moveNoteToFolder(noteId, folderId);
  };

  const handleDragOver = (e: DragEvent, target: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverTarget(target);
  };

  // ─── Export ─────────────────────────────────────────────────────

  const exportNote = useCallback(
    (format: "md" | "html" = "md") => {
      if (!activeNote) return;
      if (format === "md") {
        const blob = new Blob([activeNote.content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeNote.title.replace(/[^a-z0-9]/gi, "_")}.md`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === "html") {
        // Render to HTML using a temp div
        const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${activeNote.title}</title>
  <style>
    body { font-family: 'Georgia', serif; max-width: 720px; margin: 40px auto; padding: 0 20px; color: #1c1c28; line-height: 1.7; }
    h1, h2, h3 { font-family: 'Georgia', serif; }
    code { background: #f5f0e8; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    pre { background: #f5f0e8; padding: 16px; border-radius: 8px; overflow-x: auto; }
    blockquote { border-left: 4px solid #c4a35a; padding-left: 16px; font-style: italic; color: #666; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
    th { background: #f5f0e8; }
    a { color: #3d5a80; }
    hr { border: none; border-top: 1px solid #ddd; margin: 24px 0; }
  </style>
</head>
<body>
  <div id="content">${activeNote.content}</div>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
  <script>document.getElementById('content').innerHTML = marked.parse(document.getElementById('content').textContent);<\/script>
</body>
</html>`;
        const blob = new Blob([htmlContent], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${activeNote.title.replace(/[^a-z0-9]/gi, "_")}.html`;
        a.click();
        URL.revokeObjectURL(url);
      }
    },
    [activeNote]
  );

  const printNote = useCallback(() => {
    if (!activeNote) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${activeNote.title}</title>
  <style>
    body { font-family: 'Georgia', serif; max-width: 720px; margin: 40px auto; padding: 0 20px; color: #1c1c28; line-height: 1.7; }
    h1, h2, h3 { font-family: 'Georgia', serif; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 4px; }
    pre { background: #f0f0f0; padding: 16px; border-radius: 8px; overflow-x: auto; }
    blockquote { border-left: 4px solid #c4a35a; padding-left: 16px; font-style: italic; }
    @media print { body { margin: 0; } }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
</head>
<body>
  <div id="c">${activeNote.content}</div>
  <script>
    document.getElementById('c').innerHTML = marked.parse(document.getElementById('c').textContent);
    setTimeout(() => { window.print(); window.close(); }, 500);
  <\/script>
</body>
</html>`);
    printWindow.document.close();
  }, [activeNote]);

  // ─── Markdown Insert ───────────────────────────────────────────

  const insertMarkdown = useCallback(
    (prefix: string, suffix: string) => {
      const ta = textareaRef.current;
      if (!ta || !activeNote) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = activeNote.content.slice(start, end);
      const replacement = prefix + (selected || "text") + suffix;
      const newContent = activeNote.content.slice(0, start) + replacement + activeNote.content.slice(end);
      updateNote({ content: newContent });
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(start + prefix.length, start + prefix.length + (selected || "text").length);
      }, 0);
    },
    [activeNote, updateNote]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === "Escape" && zenMode) { setZenMode(false); return; }
      if (e.key === "k") return; // handled by command palette
      const action = toolbarActions.find((a) => a.shortcut === e.key);
      if (action) { e.preventDefault(); insertMarkdown(action.prefix, action.suffix); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [insertMarkdown, zenMode]);

  // ─── Filter ─────────────────────────────────────────────────────

  const q = searchQuery.toLowerCase();
  const liveNotes = notes.filter((n) => !n.trashed);
  const trashedNotes = notes.filter((n) => n.trashed);

  const filteredNotes = useMemo(() => {
    let result = showTrash ? trashedNotes : liveNotes;
    if (q) {
      result = result.filter(
        (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
      );
    }
    if (filterTag && !showTrash) {
      result = result.filter((n) => (n.tags || []).includes(filterTag));
    }
    return result;
  }, [liveNotes, trashedNotes, q, filterTag, showTrash]);

  // Sort: pinned first, then by updatedAt
  const sortedNotes = useMemo(() => {
    return [...filteredNotes].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [filteredNotes]);

  const unfolderedNotes = sortedNotes.filter((n) => !n.folderId);
  const notesInFolder = (fid: string) => sortedNotes.filter((n) => n.folderId === fid);

  const wordCount = activeNote?.content.trim().split(/\s+/).filter(Boolean).length || 0;
  const charCount = activeNote?.content.length || 0;

  // ─── Note Item Component ───────────────────────────────────────

  const NoteItem = ({ note }: { note: Note }) => (
    <div
      draggable={!showTrash}
      onDragStart={(e) => handleNoteDragStart(e, note.id)}
      onClick={() => {
        setActiveId(note.id);
        if (isMobile) setMobileView("editor");
      }}
      className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
        note.id === activeId
          ? "bg-accent/10 border border-accent/20"
          : "hover:bg-muted/50 border border-transparent"
      }`}
    >
      {!showTrash && (
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-grab" />
      )}
      {note.pinned && !showTrash && <Pin className="h-3 w-3 text-accent shrink-0" />}
      <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium truncate">{note.title}</p>
        <div className="flex items-center gap-1 mt-0.5">
          {(note.tags || []).length > 0 && !showTrash && (
            <div className="flex gap-0.5">
              {(note.tags || []).slice(0, 3).map((tagId) => {
                const tag = tags.find((t) => t.id === tagId);
                if (!tag) return null;
                return (
                  <span
                    key={tagId}
                    className="inline-block w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: tag.color }}
                    title={tag.name}
                  />
                );
              })}
            </div>
          )}
          <p className="text-[11px] text-muted-foreground truncate">
            {note.content.slice(0, 50).replace(/[#*_`\[\]]/g, "").trim() || "Empty note"}
          </p>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-all"
          >
            <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {showTrash ? (
            <>
              <DropdownMenuItem onClick={() => restoreNote(note.id)}>
                <ArchiveRestore className="h-3.5 w-3.5 mr-2" /> Restore
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => permanentlyDeleteNote(note.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete permanently
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem onClick={() => setRenameNoteDialog({ id: note.id, title: note.title })}>
                <Pencil className="h-3.5 w-3.5 mr-2" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => duplicateNote(note.id)}>
                <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => togglePin(note.id)}>
                {note.pinned ? <PinOff className="h-3.5 w-3.5 mr-2" /> : <Pin className="h-3.5 w-3.5 mr-2" />}
                {note.pinned ? "Unpin" : "Pin to top"}
              </DropdownMenuItem>
              {tags.length > 0 && (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Tag className="h-3.5 w-3.5 mr-2" /> Tags
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-40">
                    {tags.map((tag) => (
                      <DropdownMenuItem
                        key={tag.id}
                        onClick={() => toggleNoteTag(note.id, tag.id)}
                      >
                        <span
                          className="w-3 h-3 rounded-full mr-2 shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                        {(note.tags || []).includes(tag.id) && (
                          <span className="ml-auto text-xs">✓</span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              )}
              {folders.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  {note.folderId && (
                    <DropdownMenuItem onClick={() => moveNoteToFolder(note.id, null)}>
                      <FileText className="h-3.5 w-3.5 mr-2" /> Move to root
                    </DropdownMenuItem>
                  )}
                  {folders
                    .filter((f) => f.id !== note.folderId)
                    .map((f) => (
                      <DropdownMenuItem key={f.id} onClick={() => moveNoteToFolder(note.id, f.id)}>
                        <Folder className="h-3.5 w-3.5 mr-2" /> Move to {f.name}
                      </DropdownMenuItem>
                    ))}
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => trashNote(note.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="h-3.5 w-3.5 mr-2" /> Move to Trash
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  // ─── Sidebar Content ───────────────────────────────────────────

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border/50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-serif text-base font-semibold">
            {showTrash ? "Trash" : "Notes"}
          </span>
          <div className="flex items-center gap-1">
            {!showTrash && (
              <>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setFolderDialogOpen(true)} title="New folder">
                  <FolderPlus className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => { setTemplateFolderId(null); setTemplateDialogOpen(true); }} title="New note">
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setTagDialogOpen(true)} title="Manage tags">
                  <Tag className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
            {!isMobile && (
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setSidebarOpen(false)}>
                <PanelLeftClose className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder={showTrash ? "Search trash..." : "Search notes..."}
            className="pl-8 h-8 text-xs rounded-lg bg-muted/50 border-border/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Tag filters */}
        {!showTrash && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => setFilterTag(filterTag === tag.id ? null : tag.id)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-all border ${
                  filterTag === tag.id
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-border/50 text-muted-foreground hover:border-border"
                }`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: tag.color }}
                />
                {tag.name}
              </button>
            ))}
            {filterTag && (
              <button
                onClick={() => setFilterTag(null)}
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-2.5 w-2.5" /> Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {showTrash ? (
          <>
            {trashedNotes.length > 0 && (
              <div className="px-2 pb-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs text-destructive border-destructive/20 hover:bg-destructive/10 rounded-lg"
                  onClick={emptyTrash}
                >
                  <Trash2 className="h-3 w-3 mr-1.5" /> Empty Trash
                </Button>
              </div>
            )}
            {sortedNotes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
            {sortedNotes.length === 0 && (
              <div className="text-center py-8">
                <Archive className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground/60">Trash is empty</p>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Folders */}
            {folders.map((folder) => (
              <div
                key={folder.id}
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDragLeave={() => setDragOverTarget(null)}
                onDrop={(e) => handleFolderDrop(e, folder.id)}
                className={`rounded-lg transition-colors ${dragOverTarget === folder.id ? "bg-accent/10 ring-1 ring-accent/30" : ""}`}
              >
                <div className="flex items-center gap-1.5 px-2 py-1.5 group">
                  <button onClick={() => toggleFolder(folder.id)} className="p-0.5">
                    <ChevronDown
                      className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
                        expandedFolders.has(folder.id) ? "" : "-rotate-90"
                      }`}
                    />
                  </button>
                  {expandedFolders.has(folder.id) ? (
                    <FolderOpen className="h-3.5 w-3.5 text-accent shrink-0" />
                  ) : (
                    <Folder className="h-3.5 w-3.5 text-accent shrink-0" />
                  )}
                  {editingFolderId === folder.id ? (
                    <input
                      autoFocus
                      defaultValue={folder.name}
                      className="flex-1 text-[13px] font-medium bg-transparent outline-none border-b border-accent"
                      onBlur={(e) => renameFolder(folder.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") renameFolder(folder.id, (e.target as HTMLInputElement).value);
                        if (e.key === "Escape") setEditingFolderId(null);
                      }}
                    />
                  ) : (
                    <span className="flex-1 text-[13px] font-medium truncate">{folder.name}</span>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-all">
                        <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => { setTemplateFolderId(folder.id); setTemplateDialogOpen(true); }}>
                        <Plus className="h-3.5 w-3.5 mr-2" /> New note
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditingFolderId(folder.id)}>
                        <Pencil className="h-3.5 w-3.5 mr-2" /> Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => deleteFolder(folder.id)} className="text-destructive focus:text-destructive">
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {expandedFolders.has(folder.id) && (
                  <div className="ml-5 pl-2 border-l border-border/40 space-y-0.5 pb-1">
                    {notesInFolder(folder.id).map((note) => (
                      <NoteItem key={note.id} note={note} />
                    ))}
                    {notesInFolder(folder.id).length === 0 && (
                      <p className="text-[11px] text-muted-foreground/50 py-2 px-3 italic">No notes</p>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Unfoldered notes */}
            <div
              onDragOver={(e) => handleDragOver(e, "root")}
              onDragLeave={() => setDragOverTarget(null)}
              onDrop={(e) => handleFolderDrop(e, null)}
              className={`space-y-0.5 ${dragOverTarget === "root" ? "bg-accent/5 rounded-lg" : ""}`}
            >
              {folders.length > 0 && unfolderedNotes.length > 0 && (
                <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-semibold px-3 pt-3 pb-1">
                  Unfiled
                </p>
              )}
              {unfolderedNotes.map((note) => (
                <NoteItem key={note.id} note={note} />
              ))}
            </div>

            {filteredNotes.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                <p className="text-xs text-muted-foreground/60">
                  {searchQuery ? "No matching notes" : filterTag ? "No notes with this tag" : "No notes yet"}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Bottom: Trash toggle */}
      <div className="p-2 border-t border-border/50">
        <button
          onClick={() => { setShowTrash(!showTrash); setSearchQuery(""); setFilterTag(null); }}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
            showTrash
              ? "bg-destructive/10 text-destructive"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          {showTrash ? <ArchiveRestore className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
          {showTrash ? "Back to Notes" : `Trash${trashedNotes.length > 0 ? ` (${trashedNotes.length})` : ""}`}
        </button>
      </div>
    </div>
  );

  // ─── Command Palette ────────────────────────────────────────────

  const CommandPalette = () => (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Search notes, actions, folders..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Notes">
          {liveNotes
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .slice(0, 10)
            .map((note) => (
              <CommandItem
                key={note.id}
                onSelect={() => {
                  setActiveId(note.id);
                  setShowTrash(false);
                  setCommandOpen(false);
                  if (isMobile) setMobileView("editor");
                }}
              >
                <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{note.title}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">
                  {note.content.trim().split(/\s+/).filter(Boolean).length}w
                </span>
              </CommandItem>
            ))}
        </CommandGroup>
        {folders.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Folders">
              {folders.map((folder) => (
                <CommandItem
                  key={folder.id}
                  onSelect={() => {
                    setExpandedFolders((prev) => new Set(prev).add(folder.id));
                    setShowTrash(false);
                    setCommandOpen(false);
                  }}
                >
                  <Folder className="h-4 w-4 mr-2 text-accent" />
                  <span>{folder.name}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {liveNotes.filter((n) => n.folderId === folder.id).length} notes
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => { setTemplateFolderId(null); setTemplateDialogOpen(true); setCommandOpen(false); }}>
            <Plus className="h-4 w-4 mr-2" /> New Note
          </CommandItem>
          <CommandItem onSelect={() => { setFolderDialogOpen(true); setCommandOpen(false); }}>
            <FolderPlus className="h-4 w-4 mr-2" /> New Folder
          </CommandItem>
          {activeNote && (
            <>
              <CommandItem onSelect={() => { exportNote("md"); setCommandOpen(false); }}>
                <Download className="h-4 w-4 mr-2" /> Export as Markdown
              </CommandItem>
              <CommandItem onSelect={() => { exportNote("html"); setCommandOpen(false); }}>
                <FileCode className="h-4 w-4 mr-2" /> Export as HTML
              </CommandItem>
              <CommandItem onSelect={() => { printNote(); setCommandOpen(false); }}>
                <Printer className="h-4 w-4 mr-2" /> Print / Save as PDF
              </CommandItem>
              <CommandItem onSelect={() => { togglePin(activeNote.id); setCommandOpen(false); }}>
                <Pin className="h-4 w-4 mr-2" /> {activeNote.pinned ? "Unpin" : "Pin"} Note
              </CommandItem>
            </>
          )}
          <CommandItem onSelect={() => { setZenMode(!zenMode); setCommandOpen(false); }}>
            <Maximize className="h-4 w-4 mr-2" /> Toggle Zen Mode
          </CommandItem>
          <CommandItem onSelect={() => { setShowTrash(!showTrash); setCommandOpen(false); }}>
            <Archive className="h-4 w-4 mr-2" /> {showTrash ? "Back to Notes" : "Open Trash"}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );

  // ─── Mobile Layout ──────────────────────────────────────────────

  if (isMobile || (typeof window !== "undefined" && window.innerWidth < 768)) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {!zenMode && <Navbar />}

        <div className={`flex-1 flex flex-col overflow-hidden ${!zenMode ? "pt-20" : ""}`}>
          {mobileView === "sidebar" && (
            <div className="flex-1 overflow-hidden">
              <SidebarContent />
            </div>
          )}

          {mobileView === "editor" && activeNote && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Mobile toolbar */}
              <div className="border-b border-border/50 bg-card px-3 py-2 flex items-center gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setMobileView("sidebar")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <input
                  value={activeNote.title}
                  onChange={(e) => updateNote({ title: e.target.value })}
                  className="bg-transparent outline-none font-medium text-sm flex-1 min-w-0"
                  placeholder="Note title..."
                />
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setMobileView("preview")}>
                  <Eye className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Download className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => exportNote("md")}>
                      <Download className="h-3.5 w-3.5 mr-2" /> Export .md
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportNote("html")}>
                      <FileCode className="h-3.5 w-3.5 mr-2" /> Export .html
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={printNote}>
                      <Printer className="h-3.5 w-3.5 mr-2" /> Print / PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {/* Mobile formatting bar */}
              <div className="border-b border-border/30 bg-card/50 px-2 py-1.5 flex gap-0.5 overflow-x-auto">
                {toolbarActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => insertMarkdown(action.prefix, action.suffix)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0"
                  >
                    <action.icon className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={activeNote.content}
                onChange={(e) => updateNote({ content: e.target.value })}
                className="flex-1 resize-none bg-background p-4 font-mono text-sm leading-relaxed outline-none"
                placeholder="Start writing..."
                spellCheck={false}
              />
              <div className="border-t border-border/50 bg-card px-4 py-1.5 flex justify-between text-[11px] text-muted-foreground">
                <span>{wordCount} words · {charCount} chars</span>
                <span>Markdown</span>
              </div>
            </div>
          )}

          {mobileView === "preview" && activeNote && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="border-b border-border/50 bg-card px-3 py-2 flex items-center gap-2">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setMobileView("editor")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">{activeNote.title} — Preview</span>
              </div>
              <div className="flex-1 overflow-y-auto p-5 markdown-preview">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeNote.content}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Dialogs */}
        <CommandPalette />
        <FolderDialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen} value={newFolderName} onChange={setNewFolderName} onSubmit={createFolder} />
        <RenameDialog data={renameNoteDialog} onClose={() => setRenameNoteDialog(null)} onRename={(id, title) => { setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, title, updatedAt: Date.now() } : n))); setRenameNoteDialog(null); }} />
        <TagDialog open={tagDialogOpen} onOpenChange={setTagDialogOpen} tags={tags} newName={newTagName} newColor={newTagColor} onNameChange={setNewTagName} onColorChange={setNewTagColor} onCreate={createTag} onDelete={deleteTag} />
        <TemplateDialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen} onSelect={(t) => createFromTemplate(t, templateFolderId)} />
      </div>
    );
  }

  // ─── Desktop Layout ─────────────────────────────────────────────

  return (
    <div className="h-screen flex flex-col bg-background">
      {!zenMode && <Navbar />}

      <div className={`flex flex-1 overflow-hidden ${!zenMode ? "pt-20" : ""}`}>
        {/* Sidebar */}
        {!zenMode && sidebarOpen && (
          <div className="w-64 border-r border-border/50 bg-card/50 flex flex-col shrink-0">
            <SidebarContent />
          </div>
        )}

        {/* Main Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="border-b border-border/50 bg-card/80 backdrop-blur-sm px-3 py-2 flex items-center gap-1 flex-wrap">
            {!sidebarOpen && !zenMode && (
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 mr-1" onClick={() => setSidebarOpen(true)}>
                <PanelLeft className="h-4 w-4" />
              </Button>
            )}

            {activeNote && (
              <>
                <input
                  value={activeNote.title}
                  onChange={(e) => updateNote({ title: e.target.value })}
                  className="bg-transparent border-none outline-none font-medium text-sm mr-3 w-44"
                  placeholder="Note title..."
                />

                <div className="h-5 w-px bg-border/50 mx-1" />

                <div className="flex items-center gap-0.5">
                  {toolbarActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => insertMarkdown(action.prefix, action.suffix)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      title={action.label + (action.shortcut ? ` (Ctrl+${action.shortcut.toUpperCase()})` : "")}
                    >
                      <action.icon className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>

                <div className="flex-1" />

                {/* Command Palette trigger */}
                <button
                  onClick={() => setCommandOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border/50 bg-muted/30 text-[11px] text-muted-foreground hover:bg-muted/60 transition-colors mr-1"
                >
                  <Command className="h-3 w-3" />
                  <span>Ctrl+K</span>
                </button>

                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowPreview(!showPreview)}
                  title={showPreview ? "Hide preview" : "Show preview"}
                >
                  {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>

                {/* Export dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Export">
                      <Download className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={() => exportNote("md")}>
                      <Download className="h-3.5 w-3.5 mr-2" /> Export .md
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportNote("html")}>
                      <FileCode className="h-3.5 w-3.5 mr-2" /> Export .html
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={printNote}>
                      <Printer className="h-3.5 w-3.5 mr-2" /> Print / Save as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setZenMode(!zenMode)} title="Zen Mode">
                  {zenMode ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </>
            )}
          </div>

          {/* Editor + Preview */}
          {activeNote ? (
            <div className="flex-1 flex overflow-hidden">
              <div className={`flex flex-col min-w-0 ${showPreview ? "flex-1" : "w-full"}`}>
                <textarea
                  ref={textareaRef}
                  value={activeNote.content}
                  onChange={(e) => updateNote({ content: e.target.value })}
                  className="flex-1 resize-none bg-background p-6 font-mono text-sm leading-relaxed outline-none custom-scrollbar"
                  placeholder="Start writing markdown..."
                  spellCheck={false}
                />
              </div>

              {showPreview && (
                <>
                  <div className="w-px bg-border/50" />
                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar markdown-preview">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeNote.content}</ReactMarkdown>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <AlignLeft className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="font-serif text-xl mb-3">No note selected</p>
                <Button onClick={() => { setTemplateFolderId(null); setTemplateDialogOpen(true); }} variant="outline" size="sm" className="rounded-xl">
                  <Plus className="h-4 w-4 mr-1" /> Create a note
                </Button>
              </div>
            </div>
          )}

          {/* Status Bar */}
          <div className="border-t border-border/50 bg-card/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
              {activeNote?.pinned && (
                <span className="text-accent flex items-center gap-0.5">
                  <Pin className="h-2.5 w-2.5" /> Pinned
                </span>
              )}
              {activeNote?.folderId && (
                <span className="text-accent">
                  📁 {folders.find((f) => f.id === activeNote.folderId)?.name}
                </span>
              )}
              {activeNote && (activeNote.tags || []).length > 0 && (
                <span className="flex items-center gap-1">
                  {(activeNote.tags || []).map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <span key={tagId} className="flex items-center gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tag.color }} />
                        {tag.name}
                      </span>
                    );
                  })}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span>Markdown</span>
              {zenMode && (
                <button onClick={() => setZenMode(false)} className="hover:text-foreground transition-colors">
                  Exit Zen · Esc
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CommandPalette />
      <FolderDialog open={folderDialogOpen} onOpenChange={setFolderDialogOpen} value={newFolderName} onChange={setNewFolderName} onSubmit={createFolder} />
      <RenameDialog data={renameNoteDialog} onClose={() => setRenameNoteDialog(null)} onRename={(id, title) => { setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, title, updatedAt: Date.now() } : n))); setRenameNoteDialog(null); }} />
      <TagDialog open={tagDialogOpen} onOpenChange={setTagDialogOpen} tags={tags} newName={newTagName} newColor={newTagColor} onNameChange={setNewTagName} onColorChange={setNewTagColor} onCreate={createTag} onDelete={deleteTag} />
      <TemplateDialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen} onSelect={(t) => createFromTemplate(t, templateFolderId)} />
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────

function FolderDialog({
  open, onOpenChange, value, onChange, onSubmit,
}: {
  open: boolean; onOpenChange: (v: boolean) => void; value: string; onChange: (v: string) => void; onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif">New Folder</DialogTitle>
        </DialogHeader>
        <Input autoFocus placeholder="Folder name..." value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSubmit()} className="rounded-lg" />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Cancel</Button>
          <Button onClick={onSubmit} className="bg-foreground text-background hover:bg-foreground/90 rounded-xl">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RenameDialog({
  data, onClose, onRename,
}: {
  data: { id: string; title: string } | null; onClose: () => void; onRename: (id: string, title: string) => void;
}) {
  const [value, setValue] = useState("");
  useEffect(() => { if (data) setValue(data.title); }, [data]);
  return (
    <Dialog open={!!data} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif">Rename Note</DialogTitle>
        </DialogHeader>
        <Input autoFocus value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && data && onRename(data.id, value)} className="rounded-lg" />
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl">Cancel</Button>
          <Button onClick={() => data && onRename(data.id, value)} className="bg-foreground text-background hover:bg-foreground/90 rounded-xl">Rename</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TagDialog({
  open, onOpenChange, tags, newName, newColor, onNameChange, onColorChange, onCreate, onDelete,
}: {
  open: boolean; onOpenChange: (v: boolean) => void; tags: NoteTag[]; newName: string; newColor: string; onNameChange: (v: string) => void; onColorChange: (v: string) => void; onCreate: () => void; onDelete: (id: string) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif">Manage Tags</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {tags.length > 0 && (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {tags.map((tag) => (
                <div key={tag.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/30">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: tag.color }} />
                  <span className="text-sm flex-1">{tag.name}</span>
                  <button onClick={() => onDelete(tag.id)} className="p-0.5 rounded hover:bg-muted">
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Tag name..."
              value={newName}
              onChange={(e) => onNameChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onCreate()}
              className="rounded-lg flex-1"
            />
          </div>
          <div className="flex gap-1.5">
            {TAG_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => onColorChange(color)}
                className={`w-6 h-6 rounded-full transition-all ${newColor === color ? "ring-2 ring-foreground ring-offset-2 ring-offset-background scale-110" : "hover:scale-110"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">Done</Button>
          <Button onClick={onCreate} disabled={!newName.trim()} className="bg-foreground text-background hover:bg-foreground/90 rounded-xl">Add Tag</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function TemplateDialog({
  open, onOpenChange, onSelect,
}: {
  open: boolean; onOpenChange: (v: boolean) => void; onSelect: (t: typeof TEMPLATES[number]) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">New Note</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">Choose a template to get started</p>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((template) => (
            <button
              key={template.name}
              onClick={() => onSelect(template)}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border/50 hover:border-accent/40 hover:bg-accent/5 transition-all text-center group"
            >
              <template.icon className="h-6 w-6 text-muted-foreground group-hover:text-accent transition-colors" />
              <span className="text-xs font-medium">{template.name}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Editor;
